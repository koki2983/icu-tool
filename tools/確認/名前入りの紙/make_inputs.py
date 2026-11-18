# 名前入りの紙の入力を作る（名前はリポジトリに置かない）
# 使い方：python3 make_inputs.py <名前なしの入力.json> <記号と名前の対応表.docx または .tsv>
#   名前なしの入力.json … プロジェクト資料「ICUアプリ_名前入りの紙の作り方」の JSON を保存したもの
#   対応表 … 小山田の手元の Word（ICUツール_記号と名前の対応表.docx）か、「記号<TAB>名前」の TSV
# 作るもの（このフォルダに）：people.json nurses.json nurse_<記号>.json pharm.json ce.json test.json resident.json general.json all_map.txt titles.json
import sys,json,re,zipfile,html
src,mp=sys.argv[1],sys.argv[2]
D=json.load(open(src,encoding='utf8'))
def read_map(path):
    m={}
    if path.endswith('.docx'):
        x=zipfile.ZipFile(path).read('word/document.xml').decode('utf8')
        for row in re.findall(r'<w:tr[ >].*?</w:tr>',x,flags=re.S):
            cells=[html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>',c))) for c in re.findall(r'<w:tc>.*?</w:tc>',row,flags=re.S)]
            if len(cells)>=2 and re.match(r'^[A-Z]\d{2,3}$',cells[0].strip()): m[cells[0].strip()]=cells[1].strip()
    else:
        for l in open(path,encoding='utf8'):
            a=l.rstrip('\n').split('\t')
            if len(a)>=2 and re.match(r'^[A-Z]\d{2,3}$',a[0].strip()): m[a[0].strip()]=a[1].strip()
    # 対応表の名前の欄は「名前（役職）」のことがあるので、かっこを外す
    return {k:re.sub(r'（[^）]*）$','',v).strip() for k,v in m.items()}
M=read_map(mp)
need=[e['code'] for g in ('doctors','nurses','pharm','ce') for e in D[g]['list']]
miss=[c for c in need if c not in M]
if miss: sys.exit('対応表に見つからない記号：'+'、'.join(miss))
W=lambda f,o:json.dump(o,open(f,'w',encoding='utf8'),ensure_ascii=False,indent=1)
doc=D['doctors'];ppl=[];ex={}
for i,e in enumerate(doc['list']):
    assert e['code']=='D%02d'%(i+1),'医師の記号は D01 から順に並べる（記号は並び順で決まる）：'+e['code']
    n=M[e['code']];ppl.append([n,e['dept']])
    x={k:v for k,v in e.items() if k in('wide','extra','items')}
    if x: ex[n]=x
W('people.json',{'depts':doc['depts'],'people':ppl,'extra':ex})
nu=D['nurses'];W('nurses.json',{'depts':nu['depts'],'people':[[M[e['code']],e['title'],e['dept'],e['key'],e['code']] for e in nu['list']]})
for e in nu['list']: W('nurse_%s.json'%e['code'],{'depts':{e['key']:nu['depts'][e['key']]},'people':[[M[e['code']],e['title'],e['dept'],e['key'],e['code']]]})
for g,f in (('pharm','pharm.json'),('ce','ce.json')):
    for i,e in enumerate(D[g]['list']): assert e['code']==('P' if g=='pharm' else 'E')+'%02d'%(i+1)
    W(f,{'depts':D[g]['depts'],'people':[[M[e['code']],e['title'],e['dept'],e['key']] for e in D[g]['list']]})
for g in ('test','resident','general'): W(g+'.json',D[g])
rows=[[e['code'],M[e['code']],e['dept']] for e in doc['list']]
ov=D.get('map_dept_override',{})
rows+=[[e['code'],M[e['code']],ov.get(e['code'],e['dept'] or e['title'])] for e in nu['list']]
rows+=[[e['code'],M[e['code']],e['dept']] for g in ('pharm','ce') for e in D[g]['list']]
rows+=D['map_extra']
open('all_map.txt','w',encoding='utf8').write('\n'.join('\t'.join(r) for r in rows)+'\n')
W('titles.json',D.get('map_titles',{}))
print('作った：医師',len(ppl),'／看護',len(nu['list']),'／薬剤',len(D['pharm']['list']),'／臨床工学',len(D['ce']['list']),'／対応表',len(rows),'件')
