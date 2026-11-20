# 名前入りの紙（1 人 1 枚の内容確認のお願い）の作り方

目的：配る紙を、あとからでも同じ形で作り直せるようにする（人の追加、項目の変更、題の変更のとき）
読む人：このアプリを直す人（人でも AI でも）
ゴール：記号と QR コードを変えずに、名前入りの紙と対応表を作り直す

## 大事な決まり（理由つき）
1. 名前はこのリポジトリに入れない。理由：公開リポジトリで、誰でも見られるため。このフォルダの .gitignore で、作った JSON・Word・対応表を入れないようにしてある
2. 名前は、Project の資料「ICUアプリ_記号と名前の対応表」（TSV）か、小山田さんの手元の「ICUツール_記号と名前の対応表.docx」からだけ取る。記号ごとの所属と見ていただく項目は、Project の資料「ICUアプリ_名前入りの紙の作り方」の JSON（名前なし）に置いてある。理由：記号と資格の組み合わせも、院内の人を特定できるため、公開リポジトリには置かない
3. 医師の記号は並び順で決まる（D01 から）。新しい人は必ず最後に足す。途中に入れると、配った紙の記号がずれて、誰の指摘か分からなくなる
4. 行の高さは固定にする（fixlines.py。各 build の最後で自動で走る）。理由：游ゴシックは Word で行が高くなり、こちらで 1 枚でも Word で 2 枚になるため

## 手順
1. `npm install docx qrcode`（このフォルダか、NODE_PATH で指す場所に）
2. Project の資料の JSON を `noname_inputs.json`、対応表の資料の表を `map.tsv` として、このフォルダに保存（Word の対応表でもよい）
3. `python3 make_inputs.py noname_inputs.json map.tsv`
   → people.json、nurses.json、nurse_N01.json〜、pharm.json、ce.json、test.json、resident.json、general.json、all_map.txt、titles.json ができる
4. 作る
   - 先生方（全員）：`node build.js`
   - 先生の一部だけ：`ONLY=D10,D11 OUT="ICUツール_内容確認のお願い_一部.docx" node build.js`
   - 看護部（全員）：`node build_n.js nurses.json "ICUツール_内容確認のお願い_看護部_名前入り.docx"`
   - 看護師 1 人：`node build_n.js nurse_N05.json "ICUツール_内容確認のお願い_N05.docx"`（ファイル名は自由）
   - 薬剤部 `node build_p.js`／臨床工学部 `node build_e.js`／テスト用 `node build_t.js`／研修医（共通 R01）`node build_r.js`／誰にでも渡せる共通の紙（D99・N99）`node build_g.js`
   - 対応表：`node build_map.js`
5. 確かめる
   - `soffice --headless --convert-to pdf <Word>` → `pdfinfo` で 1 人 1 ページか
   - `python3 fill.py <PDF>`：下の余白まで、どのくらい使っているか（90% 以下なら Word でも 1 枚に収まる）
   - QR コードを読み取り、`#review&r=記号` が本人の記号か（OpenCV の QRCodeDetector）
6. 人を足す・項目を変えたら、Project の資料の JSON も直す（そこが正）

## 記号
D 医師（D01〜、D99 は医師共通）／N 看護師（N01〜、N99 は看護師共通）／P 薬剤師／E 臨床工学技士／R01 研修医共通／T01 小山田さんのテスト用
