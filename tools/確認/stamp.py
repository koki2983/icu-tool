import re,datetime,sys
p='/home/claude/icu-tool/index.html';h=open(p).read()
t=(datetime.datetime.utcnow()+datetime.timedelta(hours=9)).strftime('%Y-%m-%d %H:%M')
h2,n=re.subn(r"const APP_BUILD='[^']*';","const APP_BUILD='"+t+"';",h)
assert n==1 and h2.startswith('<!');open(p,'w').write(h2);print('BUILD',t)
