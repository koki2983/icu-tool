import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
pdfmetrics.registerFont(TTFont('NJ','/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf'))
pdfmetrics.registerFont(TTFont('NJB','/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf'))
URL='https://koki2983.github.io/icu-tool/'
img=qrcode.make(URL,border=1);img.save('qr.png')
TEAL=HexColor('#1F7A8C');GRAY=HexColor('#555555')
# ---- 1. 配布カード（名刺サイズ 91×55mm、A4 に 10 枚）
c=canvas.Canvas('ICUツール_配布カード.pdf',pagesize=A4)
W,H=A4;cw,ch=91*mm,55*mm;x0=(W-2*cw)/2;y0=(H-5*ch)/2
for r in range(5):
    for k in range(2):
        x=x0+k*cw;y=y0+r*ch
        c.setStrokeColor(HexColor('#BBBBBB'));c.setDash(2,2);c.rect(x,y,cw,ch);c.setDash()
        c.drawImage('qr.png',x+5*mm,y+6*mm,38*mm,38*mm)
        c.setFillColor(TEAL);c.setFont('NJB',13);c.drawString(x+46*mm,y+44*mm,'ICU ツール')
        c.setFillColor(HexColor('#222222'));c.setFont('NJ',8.5)
        for i,t in enumerate(['計算・スコア・知識・当院の運用','ログイン不要・無料・iPhone/Android','QR を読んで「ホーム画面に追加」']):
            c.drawString(x+46*mm,y+37*mm-i*5*mm,t)
        c.setFont('NJ',6.5);c.setFillColor(GRAY)
        c.drawString(x+46*mm,y+18*mm,'koki2983.github.io/icu-tool/')
        c.drawString(x+46*mm,y+13*mm,'患者の氏名・ID は入力しない')
        c.drawString(x+46*mm,y+8*mm,'当院の基準・医師の指示が優先')
c.showPage();c.save()
# ---- 2. ホーム画面に追加する手順（A4 1 枚）
from reportlab.pdfbase.pdfmetrics import stringWidth
def wrap(t,font,size,maxw):
    out=[];cur=''
    for ch in t:
        if stringWidth(cur+ch,font,size)>maxw: out.append(cur);cur=ch
        else: cur+=ch
    if cur: out.append(cur)
    return out
c=canvas.Canvas('ICUツール_ホーム画面に追加する手順.pdf',pagesize=A4)
LM=20*mm;TW=W-2*LM
c.setFillColor(TEAL);c.setFont('NJB',19);c.drawString(LM,H-24*mm,'ICU ツールをスマホのホーム画面に追加する')
c.setFillColor(HexColor('#222222'));c.setFont('NJ',10.5)
y=H-33*mm
for ln in wrap('アプリストアから入れるものではなく、Web ページをアプリのように使います。1 回だけ設定すれば、次からはホーム画面のアイコンから開けます。',  'NJ',10.5,TW-48*mm): c.drawString(LM,y,ln);y-=5.5*mm
c.drawImage('qr.png',W-LM-42*mm,H-72*mm,42*mm,42*mm)
c.setFont('NJ',8.5);c.drawString(W-LM-42*mm,H-76*mm,'koki2983.github.io/icu-tool/')
def block(title,steps,y,bw=TW-48*mm):
    c.setFillColor(TEAL);c.setFont('NJB',13.5);c.drawString(LM,y,title);y-=8*mm
    c.setFillColor(HexColor('#222222'));c.setFont('NJ',11)
    for i,s_ in enumerate(steps):
        lines=wrap(s_,'NJ',11,bw-10*mm)
        c.drawString(LM+4*mm,y,f'{i+1}.');
        for j,ln in enumerate(lines):
            c.drawString(LM+10*mm,y,ln);y-=6.2*mm
        y-=1.5*mm
    return y-4*mm
y=H-48*mm
y=block('iPhone（Safari）',['カメラで QR コードを読み取り、出てきたリンクを開く（Safari で開く）','画面下の「共有」ボタン（四角から上に矢印が出ているマーク）を押す','下にスクロールして「ホーム画面に追加」を押す','右上の「追加」を押す → ホーム画面に「ICU ツール」のアイコンができる'],y)
y=block('Android（Chrome）',['カメラか QR アプリで QR コードを読み取り、リンクを Chrome で開く','右上の「縦に点が 3 つ並んだボタン」（メニュー）を押す','「ホーム画面に追加」または「アプリをインストール」を押す','「追加」を押す → ホーム画面にアイコンができる'],y,TW)
y=block('うまくいかないとき',['Safari／Chrome 以外のブラウザ（LINE の中のブラウザなど）で開いていると「ホーム画面に追加」が出ない → リンクをコピーして Safari／Chrome で開き直す','古い画面のままのとき：アイコンから完全に閉じて開き直す。それでも古いときは、URL の最後に「?v=1」を付けて開く','輸液シート・自分の薬剤・メモは、その端末の中だけに保存される。端末を変えると消える（患者情報を入れないのはこのため）'],y,TW)
c.setFillColor(HexColor('#C0392B'));c.setFont('NJB',13.5);c.drawString(LM,y,'使うときの約束');y-=8*mm
c.setFillColor(HexColor('#222222'));c.setFont('NJ',11)
for t in ['患者の氏名・ID・生年月日など、患者が特定できる情報は入力しない（ベッド番号＋日付まで）','数値・判定は一般的な目安。当院の基準・医師の指示が優先。迷ったら先輩・医師・薬剤師に確認する','間違い・古い情報・要望を見つけたら小山田まで。すぐ直します']:
    for j,ln in enumerate(wrap(t,'NJ',11,TW-10*mm)):
        c.drawString(LM+4*mm,y,('・' if j==0 else '　')+ln);y-=6.2*mm
    y-=1.5*mm
c.setFillColor(GRAY);c.setFont('NJ',9);c.drawString(LM,18*mm,'ICU　小山田');c.drawRightString(W-LM,18*mm,'https://koki2983.github.io/icu-tool/')
c.showPage();c.save()
print('ok')
