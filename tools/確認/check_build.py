# 目的：確認用の資料（麻酔科のチェック表 A〜G のもとになる data.json と、「数字の行」のテキスト 3 つ）を、今の index.html から作り直す。
# 使い方：
#   1) node tools/確認/ex2.js index.html /tmp/all.json        … 全項目の本文を書き出す（Playwright がなくても動く）
#   2) python3 tools/確認/check_build.py /tmp/all.json 出力フォルダ
#      → 出力フォルダ/data.json（word_build_masuika.js が読む）と、出力フォルダ/確認用_数字の行_*.txt
# 抜き出す行の決まり（理由：見る人の負担を減らすため、確かめてほしい行だけにする）：
#   ・「!すぐ報告：」「!報告：」で始まる行は、数字がなくても載せる
#   ・数字のあとに単位・しきい値の語（mg、mL、%、時間、以上、未満 など）が続く行を載せる
#   ・「先輩に聞かれること」「認定看護師ならこう見る／使う」「主な根拠」の節と、「関連：」「主な根拠：」の行は載せない（例文と出典で、決まりの数字ではないから）
#   ・どの項目をどの表に入れるかは check_parts.json。新しい項目を足したら、ここにも ID を足す（足し忘れは、実行時に一覧で知らせる）
import json,re,sys,os,datetime
src,out=sys.argv[1],sys.argv[2];os.makedirs(out,exist_ok=True)
J=json.load(open(src,encoding='utf8'));X=J['extra'];D={t['id']:t for t in J['data']}
CFG=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'check_parts.json'),encoding='utf8'))
U=r'(?:%|％|mL|mg|μg|ng|kg|g|L|dL|mEq|mmol|mOsm|mmHg|cmH|kPa|cm|mm|γ|℃|時間|分|秒|日|回|倍|単位|J|kcal|U/L|以上|以下|未満|超|点|歳|G|/分)'
RX=re.compile(r'\d\s*'+U);SK=re.compile(r'先輩に聞かれること|認定看護師ならこう(見る|使う)|主な根拠')
def pick(h,b):
    if re.match(r'!(すぐ)?報告[：:]',b): return True
    if SK.search(h) or re.match(r'!?(主な根拠|関連)[：:]',b): return False
    return bool(RX.search(b))
def top(i):
    t=D[i];secs=[]
    for s in t['s']:
        ls=[b.lstrip('!') for b in s['b'] if pick(s['h'],b)]
        if ls: secs.append({'h':s['h'],'ls':ls})
    return {'id':i,'t':t['t'],'cat':t['cat'],'lv':t.get('lv',0),'secs':secs}
used=set()
parts=[]
for p in CFG['masuika']:
    tops=[top(i) for i in p['ids'] if i in D];used|=set(p['ids'])
    parts.append({'code':p['code'],'name':p['name'],'tops':tops,'n':sum(len(s['ls']) for t in tops for s in t['secs'])})
json.dump({'build':X['build'],'ntopic':X['nkid'],'gloss':X['gloss'],'nver':X['nver'],'parts':parts},open(os.path.join(out,'data.json'),'w',encoding='utf8'),ensure_ascii=False)
left=[i for i in D if i not in used];gone=[i for i in used if i not in D]
print('版',X['build'],'／表に入れた項目',sum(len(p['tops']) for p in parts),'／行',sum(p['n'] for p in parts))
print('どの表にも入っていない項目',len(left),' '.join(left));print('表にあるが本文にない ID',len(gone),' '.join(gone))
day=X['build'][:10]
HEAD='''ICU ツール　確認用：数字の入った行（%s）

目的：アプリの文章のうち、数字（量・速さ・基準値・時間）の入った行と「すぐ報告」の行だけを抜き出したものです。
見る人：ICU を管轄する麻酔科の先生、薬剤師など、内容を確かめてくださる方。
お願い：添付文書・ガイドライン・当院の基準と違う行に印をつけ、正しい内容を書きこんでください。当院のやり方が一般と違う場合は「当院は○○」と書いてください。
印のつけ方：合っている＝□ にチェック／違う＝番号に × と、正しい内容／当院では行っていない＝「なし」
注意：この文章は、生成 AI が、ガイドラインと添付文書についての知識から書いたものです。
　　　「★AI 照合」と書いた項目は、主な数字（用法・用量、禁忌、基準）だけを、AI がウェブ上の添付文書・ガイドラインの情報と見比べたものです（専門家の確認ではありません）。
　　　印のない項目は、原本と見比べていません。
作成：%s　ICU 小山田　／　アプリの版：%s
'''
for key,label,fn in [('drug','薬剤各論 %d 剤','確認用_数字の行_薬剤各論.txt'),('recent','11 月に追加した疾患・治療 %d 項目','確認用_数字の行_最近追加した疾患.txt'),('old','以前からの %d 項目','確認用_数字の行_以前からの項目.txt')]:
    tops=[top(i) for i in CFG['txt'][key] if i in D];tops=[t for t in tops if t['secs']]
    L=[HEAD%(label%len(tops),day,X['build'])];n=0
    for t in tops:
        L.append('='*60);L.append('■ '+t['t']+('　★AI 照合（一部）' if t['lv']>=1 else ''));L.append('   開く：https://koki2983.github.io/icu-tool/#k='+t['id']);L.append('')
        for s in t['secs']:
            L.append('【'+s['h']+'】')
            for l in s['ls']: n+=1;L.append('□ %d. %s'%(n,l))
            L.append('')
    open(os.path.join(out,fn),'w',encoding='utf8').write('\n'.join(L).rstrip('\n')+'\n');print(fn,len(tops),'項目',n,'行')
