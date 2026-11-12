// 目的：ICU ツールの内容を、麻酔科の医師・薬剤師に確かめてもらうための Word 文書を作る
// 出力：説明用 1 つ、チェック用 3 つ（薬剤各論／11 月に追加した疾患／以前からの項目）
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, WidthType, ShadingType, BorderStyle, Header, Footer, PageNumber,
  LevelFormat, VerticalAlign, PageBreak, TableLayoutType
} = require('docx');

const G = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const QR = id => fs.readFileSync(path.join(__dirname, 'qr', id + '.png'));
const URL = 'https://koki2983.github.io/icu-tool/';
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const FONT = { ascii: 'Arial', hAnsi: 'Arial', eastAsia: '游ゴシック', cs: 'Arial' };
const C = { brand: '0F6E7C', ink: '1F2A30', sub: '55666E', line: 'C9D3D8', soft: 'EEF4F6', red: 'C0392B', blue: '2F6FB0', pale: 'F6F9FA', ai: 'E3EEF9' };
const W = 9638; // A4・左右 2 cm の余白のときの本文の幅（DXA）

const r = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 21, bold: !!o.bold, color: o.color || C.ink, italics: !!o.it });
const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [typeof runs === 'string' ? r(runs, o) : runs],
  alignment: o.align, spacing: { before: o.before ?? 0, after: o.after ?? 80, line: o.line || 300, lineRule: 'auto' },
  numbering: o.bullet ? { reference: 'bul', level: 0 } : (o.num ? { reference: o.num, level: 0 } : undefined),
  keepNext: !!o.keepNext, indent: o.indent,
  border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.brand, space: 4 } } : undefined,
});
const h1 = t => new Paragraph({ heading: 'Heading1', children: [r(t, { size: 28, bold: true, color: C.brand })], spacing: { before: 280, after: 120 }, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.brand, space: 3 } } });
const h2 = t => new Paragraph({ heading: 'Heading2', children: [r(t, { size: 23, bold: true })], spacing: { before: 180, after: 80 }, keepNext: true });

const bd = (c = C.line) => ({ style: BorderStyle.SINGLE, size: 4, color: c });
const borders = c => ({ top: bd(c), bottom: bd(c), left: bd(c), right: bd(c) });
const cell = (children, w, o = {}) => new TableCell({
  children: Array.isArray(children) ? children : [children],
  width: { size: w, type: WidthType.DXA }, borders: borders(o.bc),
  shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: o.va || VerticalAlign.TOP,
  columnSpan: o.span,
});
const table = (widths, rows) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows, layout: TableLayoutType.FIXED });
const box = (children, fill = C.soft, bc = C.brand) => table([W], [new TableRow({ children: [cell(children, W, { fill, bc })] })]);
const img = (buf, px) => new ImageRun({ data: buf, type: 'png', transformation: { width: px, height: px } });

const styles = {
  default: { document: { run: { font: FONT, size: 21, color: C.ink } } },
  paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 28, bold: true, color: C.brand }, paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 23, bold: true, color: C.ink }, paragraph: { spacing: { before: 180, after: 80 }, keepNext: true, outlineLevel: 1 } },
  ],
};
const numbering = { config: [
  { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '・', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 300 } } } }] },
  ...['n1', 'n2', 'n3', 'n4', 'n5'].map(ref => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 340 } } } }] })),
] };
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134, header: 567, footer: 567 } };
const hdr = t => ({ default: new Header({ children: [p([r(t, { size: 16, color: C.sub })], { align: AlignmentType.RIGHT, after: 0 })] }) });
const ftr = () => ({ default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ children: ['- ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES, ' -'], font: FONT, size: 16, color: C.sub })] })] }) });

const DATE = '2026 年 11 月　　日';
const N = { drug: G.drug.reduce((a, t) => a + t.secs.reduce((b, s) => b + s.ls.length, 0), 0),
  recent: G.recent.reduce((a, t) => a + t.secs.reduce((b, s) => b + s.ls.length, 0), 0),
  old: G.old.reduce((a, t) => a + t.secs.reduce((b, s) => b + s.ls.length, 0), 0) };

/* ================= 説明用 ================= */
function explain() {
  const kids = [];
  kids.push(p([r('ICU 看護師向けツール　内容確認のお願い', { size: 36, bold: true, color: C.brand })], { after: 60 }));
  kids.push(p([r('ICU を管轄する麻酔科の先生方・薬剤部の皆様へ', { size: 22, bold: true })], { after: 40 }));
  kids.push(p([r(DATE + '　ICU　小山田 光希', { size: 20, color: C.sub })], { after: 200, rule: true }));

  kids.push(box([
    p([r('お願いの要点', { bold: true, color: C.brand, size: 23 })], { after: 60 }),
    p([r('ICU の看護師がスマートフォンで使う手引き（Web アプリ）の、')], { after: 20 }),
    p([r('量・速さ・基準値など「数字の入った行」', { bold: true }), r('が正しいかを、確かめていただけないでしょうか。')], { after: 80 }),
    p('薬剤師の方には、薬剤各論（321 行）を。', { bullet: true, after: 20 }),
    p('麻酔科の先生には、疾患・治療の項目（11 月の追加 459 行、以前から 986 行）を。', { bullet: true, after: 20 }),
    p('全部でなくても構いません。見ていただけた範囲だけ、「専門家が確認」の印に替えます。', { bullet: true, after: 0 }),
  ]));

  kids.push(h1('1. このアプリについて'));
  kids.push(table([2300, W - 2300], [new TableRow({ children: [
    cell([p([img(QR('_top'), 130)], { align: AlignmentType.CENTER, after: 20 }), p([r('アプリを開く', { size: 17, color: C.sub })], { align: AlignmentType.CENTER, after: 0 })], 2300, { bc: 'FFFFFF', va: VerticalAlign.CENTER }),
    cell([
      p('ICU の看護師が、勤務中にスマートフォンで調べものをするための手引きです。ログインは要らず、一度開けば電波のない所でも使えます。', { after: 80 }),
      p([r('中身：', { bold: true }), r('計算ツール 21／スコア 8／知識の項目 127／薬剤各論 29／用語 690。病態関連図と体の絵を 74 枚入れています。')], { after: 80 }),
      p([r('使う人：', { bold: true }), r('ICU の看護師（1 年目・異動者の教育を含む）。看護部の発表に向けて、ICU 全員で試用します。')], { after: 80 }),
      p([r(URL, { size: 18, color: C.blue })], { after: 0 }),
    ], W - 2300, { bc: 'FFFFFF' }),
  ] })]));
  kids.push(p('患者さんの氏名・ID などは入力しない決まりにしています。アプリは端末の外に何も送りません。', { before: 80, after: 40, size: 19, color: C.sub }));

  kids.push(h1('2. 内容の作り方と、今の確かさ'));
  kids.push(p('文章と図は、生成 AI（Claude）が、ガイドラインと添付文書についての知識から下書きし、私が確認して載せています。各項目には、次の印を出しています。', { after: 100 }));
  const mrow = (a, b, c, fill) => new TableRow({ children: [cell(p([r(a, { bold: true })], { after: 0 }), 2400, { fill }), cell(p(b, { after: 0 }), 5638), cell(p([r(c, { bold: true })], { align: AlignmentType.CENTER, after: 0 }), 1600)] });
  kids.push(table([2400, 5638, 1600], [
    new TableRow({ tableHeader: true, children: [cell(p([r('印', { bold: true, color: 'FFFFFF' })], { after: 0 }), 2400, { fill: C.brand }), cell(p([r('意味', { bold: true, color: 'FFFFFF' })], { after: 0 }), 5638, { fill: C.brand }), cell(p([r('今の数', { bold: true, color: 'FFFFFF' })], { align: AlignmentType.CENTER, after: 0 }), 1600, { fill: C.brand })] }),
    mrow('原本と未照合', 'AI の知識から書いたまま。', 'ほとんど', 'EEF1F3'),
    mrow('AI が原本と照合', '主な数字（用法・用量、禁忌、基準）を、AI がウェブ上の添付文書・ガイドラインの情報と見比べた。専門家の確認ではない。', `薬 ${G.cdrug}・疾患 ${G.cdis}`, C.ai),
    mrow('専門家が確認', '当院の専門職に確認していただいた。', '0', 'E6F4EA'),
  ]));
  kids.push(p('AI の照合は、医薬品情報サイトや病院の公開資料など二次資料との見比べが中心で、添付文書の原本を 1 行ずつ読んだものではありません。見比べて直した所は、最後の付録にまとめました。', { before: 100 }));
  kids.push(p('アプリの中では「当院の基準と医師の指示が優先」と明記しています。当院の希釈や報告の基準は、分かっている分だけ「当院」として載せ、それ以外は一般的な書き方のままです。'));

  kids.push(h1('3. 確かめていただきたいこと'));
  const drow = (a, b, c, d) => new TableRow({ children: [cell(p([r(a, { bold: true })], { after: 0 }), 3800), cell(p(b, { after: 0 }), 2600), cell(p(c, { align: AlignmentType.CENTER, after: 0 }), 1400), cell(p(d, { after: 0 }), 1838)] });
  kids.push(table([3800, 2600, 1400, 1838], [
    new TableRow({ tableHeader: true, children: ['チェック用の資料', '主に見ていただきたい方', '行数', '優先'].map((t, i) => cell(p([r(t, { bold: true, color: 'FFFFFF' })], { after: 0, align: i === 2 ? AlignmentType.CENTER : undefined }), [3800, 2600, 1400, 1838][i], { fill: C.brand })) }),
    drow('① 薬剤各論（29 剤）', '薬剤師', String(N.drug), '最優先（量と速さ）'),
    drow('② 11 月に追加した疾患・治療（47 項目）', '麻酔科の先生', String(N.recent), '次に'),
    drow('③ 以前からの項目（75 項目）', '麻酔科の先生', String(N.old), 'できれば'),
  ]));
  kids.push(p('どの資料も、項目ごとに QR コードを付けています。スマートフォンで読むと、アプリのその項目が開き、前後の文や図を見られます。', { before: 100 }));
  kids.push(h2('特に見ていただきたい所'));
  ['薬の量・投与速度・希釈（添付文書と違う所、当院の運用と違う所）',
   '「何 mmHg 以上で報告」などの基準値（当院で決めている値がある場合）',
   '当院では行っていない治療・使っていない薬（「なし」と書いていただければ、載せ方を変えます）',
   '危ない書き方（誤解されて事故につながりそうな行）'].forEach(t => kids.push(p(t, { bullet: true, after: 30 })));

  kids.push(h1('4. 書き方'));
  kids.push(p('チェック用の資料は、1 行に 1 つの文が並んだ表です。右の 2 つの欄に書きこんでください。紙でも、Word のまま書きこんでいただいても構いません。', { after: 100 }));
  const ex = (n, t, j, c, fill) => new TableRow({ children: [cell(p(n, { align: AlignmentType.CENTER, after: 0, size: 18 }), 620, { fill }), cell(p(t, { after: 0, size: 18 }), 5300, { fill }), cell(p([r(j, { bold: true, color: C.red, size: 20 })], { align: AlignmentType.CENTER, after: 0 }), 1000, { fill }), cell(p([r(c, { color: C.red, size: 18 })], { after: 0 }), 2718, { fill })] });
  kids.push(table([620, 5300, 1000, 2718], [
    new TableRow({ tableHeader: true, children: ['番号', 'アプリの文（数字の入った行）', '判定', '正しい内容・当院のやり方'].map((t, i) => cell(p([r(t, { bold: true, size: 18 })], { after: 0, align: i !== 1 && i !== 3 ? AlignmentType.CENTER : undefined }), [620, 5300, 1000, 2718][i], { fill: C.soft })) }),
    ex('12', '用量：添付文書は 1〜5 γ、必要なら 20 γ まで。多くは 2〜5 γ で使う。', '○', '', undefined),
    ex('13', '持続静注は 2〜10 mg/時（腎不全ではそれ以上のことも）', '×', '当院は ○〜○ mg/時で開始', undefined),
    ex('14', 'ICU 日記：入室中のできごとを、スタッフと家族が書き…', 'なし', '当院では行っていない', undefined),
  ]));
  kids.push(p('（記入の見本です。内容は実際の判断ではありません）', { before: 40, size: 17, color: C.sub }));
  kids.push(p([r('判定：', { bold: true }), r('合っている＝○、違う＝×（右に正しい内容）、当院では行っていない＝なし。迷う行は「?」だけでも助かります。')], { before: 80 }));

  kids.push(h1('5. 返し方と期限'));
  kids.push(table([2200, W - 2200], [
    ['期限', '2026 年　　月　　日 ごろまで（ご都合に合わせます）'],
    ['返し方', '紙：ICU の小山田に手渡し。Word：書きこんだファイルを Teams で小山田に。'],
    ['少しだけのとき', 'アプリの各項目の下にある「間違いを報告」ボタンからも送れます（項目名の入った文面ができます）。'],
    ['連絡先', 'ICU　小山田 光希の Teams、または直接ご連絡ください'],
  ].map(([a, b]) => new TableRow({ children: [cell(p([r(a, { bold: true })], { after: 0 }), 2200, { fill: C.soft }), cell(p(b, { after: 0 }), W - 2200)] }))));

  kids.push(h1('6. 確かめていただいたあと'));
  ['いただいた直しをアプリに反映し、その項目の印を「専門家が確認」に替えます。',
   '印には「麻酔科医」「薬剤師」などの職種と日付だけを書き、お名前は載せません（アプリは誰でも開けるため）。',
   '直した所は記録に残し、看護部の発表でも「専門職の確認を受けた」ことを伝えます。'].forEach(t => kids.push(p(t, { bullet: true, after: 30 })));

  kids.push(new Paragraph({ children: [new PageBreak()] }));
  kids.push(h1('付録　AI が原本と見比べて直した所（2026 年 11 月 13 日）'));
  kids.push(p('二次資料と見比べて直したものです。直したあとの内容も、確かめていただく対象に含めています。', { after: 100, size: 19, color: C.sub }));
  G.fix.forEach(t => kids.push(p(t, { num: 'n1', after: 40, size: 19 })));
  kids.push(table([2300, W - 2300], [new TableRow({ children: [
    cell([p([img(QR('_ref'), 110)], { align: AlignmentType.CENTER, after: 0 })], 2300, { bc: 'FFFFFF', va: VerticalAlign.CENTER }),
    cell([p([r('出典と照合の記録', { bold: true })], { after: 40 }), p('アプリの「出典・参考ガイドライン」の項目です。使ったガイドラインの一覧と、照合の記録を載せています。', { after: 40, size: 19 }), p([r(URL + '#k=references', { size: 17, color: C.blue })], { after: 0 })], W - 2300, { bc: 'FFFFFF', va: VerticalAlign.CENTER }),
  ] })]));

  return new Document({ creator: 'ICU', title: 'ICU 看護師向けツール 内容確認のお願い', styles, numbering,
    sections: [{ properties: { page }, headers: hdr('ICU 看護師向けツール　内容確認のお願い'), footers: ftr(), children: kids }] });
}

/* ================= チェック用 ================= */
function check(key, title, who, intro) {
  const topics = G[key];
  const kids = [];
  const total = topics.reduce((a, t) => a + t.secs.reduce((b, s) => b + s.ls.length, 0), 0);
  kids.push(p([r('ICU 看護師向けツール　内容確認', { size: 22, bold: true, color: C.sub })], { after: 20 }));
  kids.push(p([r(title, { size: 34, bold: true, color: C.brand })], { after: 60 }));
  kids.push(p([r(`${topics.length} 項目・${total} 行　／　主に見ていただきたい方：${who}`, { size: 20 })], { after: 160, rule: true }));
  kids.push(table([W - 2100, 2100], [new TableRow({ children: [
    cell([
      p([r('書き方', { bold: true, color: C.brand })], { after: 40 }),
      p([r('判定：', { bold: true }), r('合っている＝○、違う＝×、当院では行っていない＝なし、迷う＝?')], { after: 30, size: 19 }),
      p([r('右の欄：', { bold: true }), r('× のときは正しい内容を。当院のやり方が一般と違うときは「当院は○○」と。')], { after: 30, size: 19 }),
      p([r('★AI 照合：', { bold: true, color: C.blue }), r('主な数字だけ、AI が二次資料と見比べた項目です（専門家の確認ではありません）。印のない項目は未照合です。')], { after: 30, size: 19 }),
      p(intro, { after: 0, size: 19, color: C.sub }),
    ], W - 2100, { fill: C.pale }),
    cell([p([img(QR('_top'), 100)], { align: AlignmentType.CENTER, after: 10 }), p([r('アプリを開く', { size: 16, color: C.sub })], { align: AlignmentType.CENTER, after: 0 })], 2100, { va: VerticalAlign.CENTER }),
  ] })]));
  kids.push(table([3213, 3213, 3212], [new TableRow({ children: ['確認した方（職種）', '確認した日', 'お名前（任意）'].map(t => cell([p([r(t, { size: 17, color: C.sub })], { after: 260 })], 3213)) })]));
  kids.push(p('', { after: 60 }));

  const CW = [620, 5300, 1000, 2718];
  let n = 0;
  topics.forEach((t, ti) => {
    // 項目の見出し（名前と QR）を表の 1 行目に入れ、ページをまたいでも上に出るようにする
    const hc = t.ai ? C.blue : C.brand;
    const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: [
      cell([
        p([r(t.t.replace(/^薬剤各論：/, ''), { bold: true, size: 24, color: 'FFFFFF' })], { after: 30, keepNext: true }),
        p([r((t.cat === '薬剤詳細' ? '薬剤各論' : t.cat) + (t.ai ? '　★AI 照合（一部）' : '　原本と未照合'), { size: 17, color: 'E6F1F3' })], { after: 20, keepNext: true }),
        p([r(URL + '#k=' + t.id, { size: 15, color: 'D5E7EB' })], { after: 0, keepNext: true }),
      ], CW[0] + CW[1] + CW[2], { span: 3, fill: hc, bc: hc, va: VerticalAlign.CENTER }),
      cell([p([img(QR(t.id), 62)], { align: AlignmentType.CENTER, after: 0, keepNext: true })], CW[3], { bc: hc, va: VerticalAlign.CENTER }),
    ] }),
    new TableRow({ tableHeader: true, cantSplit: true, children: ['番号', 'アプリの文（数字の入った行）', '判定', '正しい内容・当院のやり方'].map((hh, i) => cell(p([r(hh, { bold: true, size: 17 })], { after: 0, keepNext: true, align: i === 0 || i === 2 ? AlignmentType.CENTER : undefined }), CW[i], { fill: C.soft })) })];
    t.secs.forEach(s => {
      rows.push(new TableRow({ cantSplit: true, children: [cell(p([r('【' + s.h + '】', { bold: true, size: 18, color: C.brand })], { after: 0, keepNext: true }), W, { span: 4, fill: 'FFFFFF' })] }));
      s.ls.forEach(line => {
        n++;
        rows.push(new TableRow({ cantSplit: true, children: [
          cell(p([r(String(n), { size: 17, color: C.sub })], { align: AlignmentType.CENTER, after: 0 }), CW[0]),
          cell(p([r(line, { size: 18 })], { after: 0, line: 270 }), CW[1]),
          cell(p([r('○ × なし', { size: 15, color: 'A9B6BC' })], { align: AlignmentType.CENTER, after: 0 }), CW[2], { va: VerticalAlign.CENTER }),
          cell(p('', { after: 0 }), CW[3]),
        ] }));
      });
    });
    kids.push(table(CW, rows));
    kids.push(p('', { after: 140 }));
  });
  kids.push(p([r('ご協力ありがとうございました。ICU　小山田 光希', { size: 19, color: C.sub })], { align: AlignmentType.RIGHT, before: 200 }));
  return new Document({ creator: 'ICU', title: 'ICU 看護師向けツール 内容確認 ' + title, styles, numbering,
    sections: [{ properties: { page }, headers: hdr('ICU 看護師向けツール　内容確認　' + title), footers: ftr(), children: kids }] });
}

(async () => {
  const docs = [
    ['ICUツール_内容確認のお願い（説明）.docx', explain()],
    ['ICUツール_チェック表①_薬剤各論.docx', check('drug', '① 薬剤各論', '薬剤師', '量・速さ・希釈・禁忌を中心に見ていただけると助かります。当院の希釈は、登録している分だけ「当院」と書いています。')],
    ['ICUツール_チェック表②_11月に追加した疾患.docx', check('recent', '② 11 月に追加した疾患・治療', '麻酔科の先生', '2026 年 11 月に追加した項目です。報告の基準値や、当院で行っていない治療に印をいただけると助かります。')],
    ['ICUツール_チェック表③_以前からの項目.docx', check('old', '③ 以前からの項目', '麻酔科の先生', '2026 年 10 月までに作った項目です。人工呼吸器・補助循環・鎮静など、ICU の基本の項目を含みます。')],
  ];
  for (const [name, doc] of docs) {
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(name, (buf.length / 1024).toFixed(0) + ' KB');
  }
})();
