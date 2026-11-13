# 公開の直前に走らせる。①版の日時（APP_BUILD）を今の日本時間にする ②更新の履歴（HIST）を git の記録から作り直す
# 使い方： python3 tools/確認/stamp.py "今回の変更をひとことで"   （ひとことは、これから付ける commit の題と同じにする。省いてもよい）
# 理由：履歴は git の記録から作るので、まだ commit していない今回の分は、ここで渡さないと 1 回おくれて出る
import re,datetime,sys,os,subprocess,json
root=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
p=os.path.join(root,'index.html');h=open(p,encoding='utf-8').read()
t=(datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(hours=9)).strftime('%Y-%m-%d %H:%M')
h2,n=re.subn(r"const APP_BUILD='[^']*';","const APP_BUILD='"+t+"';",h)
assert n==1 and h2.startswith('<!')
try:
    out=subprocess.run(['git','-C',root,'log','-150','--pretty=%ad\t%s','--date=format-local:%Y-%m-%d %H:%M'],capture_output=True,text=True,env=dict(os.environ,TZ='Asia/Tokyo')).stdout
    hist=[l.split('\t',1) for l in out.split('\n') if '\t' in l]
    # 題に入った医師の個人名は、履歴に出さない（理由：アプリは公開されていて、履歴は画面に出るから）。「当院：○○医師の」を科の名前に置きかえる
    hist=[[d,re.sub(r'当院：[一-龥]{1,4}医師の','当院：呼吸器外科の',t)] for d,t in hist]
    if len(sys.argv)>1 and sys.argv[1].strip() and (not hist or hist[0][1]!=sys.argv[1].strip()): hist.insert(0,[t,sys.argv[1].strip()])
    if hist:
        line='const HIST='+json.dumps(hist,ensure_ascii=False)+';'
        h2,m=re.subn(r"const HIST=\[.*?\];(?=\n)",lambda _:line,h2,count=1)
        if m!=1: print('HIST の行が見つかりません（履歴は更新していません）')
except Exception as e: print('履歴は更新できませんでした',e)
open(p,'w',encoding='utf-8').write(h2);print('BUILD',t)
