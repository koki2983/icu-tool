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

const cnt = t => t.n;
const NT = G.parts.reduce((a, x) => a + x.tops.length, 0), NR = G.parts.reduce((a, x) => a + x.n, 0);
const step = (n, t, d) => new TableRow({ cantSplit: true, children: [
  cell(p([r(String(n), { bold: true, size: 26, color: 'FFFFFF' })], { align: AlignmentType.CENTER, after: 0 }), 620, { fill: C.brand, bc: C.brand, va: VerticalAlign.CENTER }),
  cell([p([r(t, { bold: true })], { after: 20 }), p([r(d, { size: 19, color: C.sub })], { after: 0, line: 280 })], W - 620),
] });

/* ================= お願い（説明） ================= */
function explain2() {
  const k = [];
  k.push(p([r('麻酔科の先生へ', { size: 22, bold: true, color: C.sub })], { after: 20 }));
  k.push(p([r('ICU 看護師向けツール　内容確認のお願い', { size: 36, bold: true, color: C.brand })], { after: 60 }));
  k.push(p([r('ICU　小山田 光希　／　アプリの版：' + G.build, { size: 19, color: C.sub })], { after: 160, rule: true }));
  k.push(box([
    p([r('お願いしたいこと', { bold: true, color: C.brand, size: 23 })], { after: 50 }),
    p([r('ICU の看護師が勤務中に使うツールの中身に、誤りや、当院のやり方と違う所がないかを見てください。')], { after: 40 }),
    p([r('全部を見ていただく必要はありません。', { bold: true }), r('ご専門の所、気になった所だけで十分です。')], { after: 40 }),
    p([r('期限の目安：11 月 30 日ごろ　　／　　返し方：スマホの「確認モード」なら自動で届きます。紙に書きこんでも構いません')], { after: 60 }),
    p([r('※ あくまで暫定の期限です。ICU の看護師の間では、12 月から正式に使い始める予定です。これ以降も、改善点は随時受け付け、すぐに直していきます。')], { after: 0 }),
  ]));
  k.push(table([W - 4200, 2100, 2100], [new TableRow({ children: [
    cell([p([r('スマホで見る場合は、右の「確認モード」の QR コードから開いてください。読みながら、気になる行に指摘を残せます（使い方は「4. 見かた」）。URL の送付をご希望の方は、ICU 小山田へお申し付けください。Teams でお送りします。', { size: 19 })], { after: 0, line: 290 })], W - 4200, { bc: 'FFFFFF', va: VerticalAlign.CENTER }),
    cell([p([img(QR('_review'), 104)], { align: AlignmentType.CENTER, after: 10 }), p([r('確認モードで開く', { size: 17, bold: true, color: C.brand })], { align: AlignmentType.CENTER, after: 0 })], 2100, { bc: 'FFFFFF' }),
    cell([p([img(QR('_top'), 104)], { align: AlignmentType.CENTER, after: 10 }), p([r('ふつうに開く', { size: 17, color: C.sub })], { align: AlignmentType.CENTER, after: 0 })], 2100, { bc: 'FFFFFF' }),
  ] })]));

  k.push(h1('1. このツールについて'));
  k.push(p('ICU の看護師が、受け持ちの前やケアの合間に、スマホで要点を引くためのものです。知識メモ（疾患・術後管理・機器）、薬剤各論、計算ツール、用語集が入っています。', { after: 60 }));
  k.push(p([r(`知識メモ・薬剤各論 ${G.ntopic} 項目、用語 ${G.gloss} 語。`, { bold: true }), r('患者さんの氏名や ID は入れない作りです。インターネットにつながらない所でも使えます。')], { after: 60 }));
  k.push(p('看護師の観察と報告を助けることが目的で、治療を決めるものではありません。各項目に「当院の基準と医師の指示が優先」と書いています。', { after: 0 }));

  k.push(h1('2. ここまでに行ったこと（限界も含めて）'));
  k.push(p('本文は、小山田が AI（Claude）を使って作りました。そのうえで、次のことを行っています。', { after: 60 }));
  k.push(p([r('AI による照合：', { bold: true }), r(`主な数字を、ウェブで読める添付文書・ガイドライン・病院の公開資料と見比べました（${G.nver} 項目。アプリの中で青い印が付いています）。原本そのものではない資料も含みます。`)], { bullet: true, after: 40 }));
  k.push(p([r('AI による第三者点検：', { bold: true }), r('11 月 13 日に、書いたときとは別の AI に全項目を読ませ、誤字、項目どうしの数字の食い違い、言いすぎを直しました。直した内容は、アプリの「更新の履歴」で見られます。')], { bullet: true, after: 40 }));
  k.push(p([r('本人の確認：', { bold: true }), r('小山田が読み、当院のやり方と違う所を直しました。')], { bullet: true, after: 60 }));
  k.push(box([p([r('専門家の確認は、まだ受けていません。', { bold: true, color: C.red }), r('AI の照合は見落としがあり得ます。誤りが残っている前提で見ていただけると助かります。')], { after: 0 })], 'FDF3F2', C.red));

  k.push(h1('3. 見ていただきたい点'));
  [['量・速さ・濃度・基準値の誤り', '薬の量、希釈、報告の目安の数字など。'],
   ['当院のやり方と違う所', '当院では行っていない治療、当院の基準と違う数字。「当院は○○」と教えてください。'],
   ['看護師に勧めるべきでない書き方', '看護師の判断の範囲を越えている、言い切りすぎている、誤解されやすい表現。'],
   ['抜けている大事な注意', 'これは必ず書いておくべき、という点。']].forEach(([a, b], i) =>
    k.push(p([r(a, { bold: true }), r('　' + b)], { num: 'n1', after: 40 })));

  k.push(h1('4. 見かた（どちらでも）'));
  k.push(h2('A. スマホの「確認モード」で見る'));
  k.push(table([620, W - 620], [
    step(1, '1 ページの「確認モードで開く」の QR コードを読む', 'アプリが開き、左下にオレンジ色の「確認モード」のボタンが出ます。アプリを入れる必要はありません。'),
    step(2, '見たい項目を開く', '知識メモの一覧や検索から開きます。薬は「薬剤」のタブです。チェック表の各項目の QR コードからも開けます。'),
    step(3, '気になる行の「指摘する」を押して、内容を書く', 'どこがどう違うか、正しい値、根拠があれば書いてください。問題がなければ、項目の上の「この項目は問題なし」を押します。'),
    step(4, '最初に、左下の「確認モード」のボタンから職種・お名前を書く（任意）', '書いておくと、どなたの指摘か分かります。指摘の一覧もここで見られます。'),
    step(5, '送る操作は要りません', '「指摘を残す」「この項目は問題なし」を押すたびに、その 1 件が自動で小山田の Teams に届きます（病院の Microsoft Teams）。指摘の欄に、患者さんの情報は書かないでください。電波がないときは端末にためて、つながったときに送ります。'),
  ]));
  k.push(p('', { after: 80 }));
  k.push(h2('B. 紙のチェック表に書きこむ'));
  k.push(p('チェック表は、数字の入った行と「すぐ報告」の行を抜き出したものです。判定の欄に ○・×・なし（当院では行っていない）を付け、× のときは右の欄に正しい内容を書いてください。書いた紙は、小山田に渡してください。', { after: 0 }));

  k.push(h1('5. チェック表の分け方'));
  k.push(p(`全部で ${NT} 項目・${NR} 行あります。先生方の人数とご専門に合わせて、分けて使ってください。`, { after: 80 }));
  const CW = [700, 4600, 900, 900, 2538];
  const hd = new TableRow({ tableHeader: true, children: ['記号', '内容', '項目', '行', '見てくださる方'].map((t, i) => cell(p([r(t, { bold: true, size: 18 })], { after: 0, align: i === 1 || i === 4 ? undefined : AlignmentType.CENTER }), CW[i], { fill: C.soft })) });
  k.push(table(CW, [hd, ...G.parts.map(x => new TableRow({ cantSplit: true, children: [
    cell(p([r(x.code, { bold: true, size: 24, color: C.brand })], { align: AlignmentType.CENTER, after: 0 }), CW[0], { va: VerticalAlign.CENTER }),
    cell(p([r(x.name, { size: 19 })], { after: 0 }), CW[1], { va: VerticalAlign.CENTER }),
    cell(p([r(String(x.tops.length), { size: 19 })], { align: AlignmentType.CENTER, after: 0 }), CW[2], { va: VerticalAlign.CENTER }),
    cell(p([r(String(x.n), { size: 19 })], { align: AlignmentType.CENTER, after: 0 }), CW[3], { va: VerticalAlign.CENTER }),
    cell(p('', { after: 120 }), CW[4]),
  ] }))]));

  k.push(h1('6. 確認していただいたあと'));
  k.push(p('いただいた指摘は小山田が直し、直した内容は「更新の履歴」に残します。', { bullet: true, after: 40 }));
  k.push(p('確認していただいた項目には、「専門家が確認（職種・日付）」の緑の印を付けます。お名前は出しません。', { bullet: true, after: 40 }));
  k.push(p('印を付けたあとで本文を直した項目には、「この印のあとに、本文が直されています」という知らせが自動で出ます。確認済みの印だけが残ることはありません。', { bullet: true, after: 120 }));
  k.push(box([p([r('連絡先', { bold: true, color: C.brand })], { after: 30 }), p('ICU　小山田 光希の Teams、または直接ご連絡ください。', { after: 0 })]));
  return new Document({ creator: 'ICU', title: 'ICU 看護師向けツール 内容確認のお願い（麻酔科）', styles, numbering,
    sections: [{ properties: { page }, headers: hdr('ICU 看護師向けツール　内容確認のお願い'), footers: ftr(), children: k }] });
}

/* ================= パート別のチェック表 ================= */
function check2(x) {
  const kids = [];
  kids.push(p([r('ICU 看護師向けツール　内容確認　チェック表', { size: 22, bold: true, color: C.sub })], { after: 20 }));
  kids.push(p([r(x.code + '　' + x.name, { size: 32, bold: true, color: C.brand })], { after: 60 }));
  kids.push(p([r(`${x.tops.length} 項目・${x.n} 行　／　アプリの版：${G.build}`, { size: 20 })], { after: 160, rule: true }));
  kids.push(table([W - 2100, 2100], [new TableRow({ children: [
    cell([
      p([r('書き方', { bold: true, color: C.brand })], { after: 40 }),
      p([r('判定：', { bold: true }), r('合っている＝○、違う＝×、当院では行っていない＝なし、迷う＝?')], { after: 30, size: 19 }),
      p([r('右の欄：', { bold: true }), r('× のときは正しい内容を。当院のやり方が一般と違うときは「当院は○○」と。')], { after: 30, size: 19 }),
      p([r('載っている行：', { bold: true }), r('数字の入った行と「すぐ報告」の行だけです。全文は、各項目の QR コードから開けます。')], { after: 30, size: 19 }),
      p([r('★AI 照合：', { bold: true, color: C.blue }), r('主な数字だけ、AI が資料と見比べた項目です（専門家の確認ではありません）。印のない項目は未照合です。')], { after: 0, size: 19 }),
    ], W - 2100, { fill: C.pale }),
    cell([p([img(QR('_review'), 100)], { align: AlignmentType.CENTER, after: 10 }), p([r('確認モードで開く', { size: 16, color: C.sub })], { align: AlignmentType.CENTER, after: 0 })], 2100, { va: VerticalAlign.CENTER }),
  ] })]));
  kids.push(table([3213, 3213, 3212], [new TableRow({ children: ['確認した方（職種）', '確認した日', 'お名前（任意）'].map(t => cell([p([r(t, { size: 17, color: C.sub })], { after: 260 })], 3213)) })]));
  kids.push(p('', { after: 60 }));
  const CW = [620, 5300, 1000, 2718];
  let n = 0;
  x.tops.forEach(t => {
    if (!t.secs.length) return;
    const ai = t.lv >= 1, hc = ai ? C.blue : C.brand;
    const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: [
      cell([
        p([r(t.t.replace(/^薬剤各論：/, ''), { bold: true, size: 24, color: 'FFFFFF' })], { after: 30, keepNext: true }),
        p([r((t.cat === '薬剤詳細' ? '薬剤各論' : t.cat) + (ai ? '　★AI 照合（一部）' : '　原本と未照合'), { size: 17, color: 'E6F1F3' })], { after: 20, keepNext: true }),
        p([r(URL + '#k=' + t.id, { size: 15, color: 'D5E7EB' })], { after: 0, keepNext: true }),
      ], CW[0] + CW[1] + CW[2], { span: 3, fill: hc, bc: hc, va: VerticalAlign.CENTER }),
      cell([p([img(QR(t.id), 62)], { align: AlignmentType.CENTER, after: 0, keepNext: true })], CW[3], { bc: hc, va: VerticalAlign.CENTER }),
    ] }),
    new TableRow({ tableHeader: true, cantSplit: true, children: ['番号', 'アプリの文', '判定', '正しい内容・当院のやり方'].map((hh, i) => cell(p([r(hh, { bold: true, size: 17 })], { after: 0, keepNext: true, align: i === 0 || i === 2 ? AlignmentType.CENTER : undefined }), CW[i], { fill: C.soft })) })];
    t.secs.forEach(s => {
      rows.push(new TableRow({ cantSplit: true, children: [cell(p([r('【' + s.h + '】', { bold: true, size: 18, color: C.brand })], { after: 0, keepNext: true }), W, { span: 4, fill: 'FFFFFF' })] }));
      s.ls.forEach(line => { n++;
        rows.push(new TableRow({ cantSplit: true, children: [
          cell(p([r(x.code + n, { size: 16, color: C.sub })], { align: AlignmentType.CENTER, after: 0 }), CW[0]),
          cell(p([r(line, { size: 18 })], { after: 0, line: 270 }), CW[1]),
          cell(p([r('○ × なし', { size: 15, color: 'A9B6BC' })], { align: AlignmentType.CENTER, after: 0 }), CW[2], { va: VerticalAlign.CENTER }),
          cell(p('', { after: 0 }), CW[3]),
        ] })); });
    });
    kids.push(table(CW, rows));
    kids.push(p('', { after: 140 }));
  });
  kids.push(p([r('ご協力ありがとうございました。ICU　小山田 光希', { size: 19, color: C.sub })], { align: AlignmentType.RIGHT, before: 200 }));
  return new Document({ creator: 'ICU', title: 'ICU ツール チェック表 ' + x.code, styles, numbering,
    sections: [{ properties: { page }, headers: hdr('ICU 看護師向けツール　チェック表 ' + x.code + '　' + x.name), footers: ftr(), children: kids }] });
}

(async () => {
  const docs = [['ICUツール_麻酔科_0_内容確認のお願い.docx', explain2()], ...G.parts.map(x => [`ICUツール_麻酔科_チェック表${x.code}_${x.name.replace(/（.*?）/g, '').replace(/・/g, '')}.docx`, check2(x)])];
  for (const [name, doc] of docs) { const buf = await Packer.toBuffer(doc); fs.writeFileSync(path.join(OUT, name), buf); console.log(name, (buf.length / 1024).toFixed(0) + ' KB'); }
})();
