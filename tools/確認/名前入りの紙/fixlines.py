# Word と LibreOffice で行の高さをそろえる：行間「自動」を「固定」に置き換える（QR の画像の段落は除く）
# 理由：游ゴシックは Word で行が高くなり、こちらで 1 枚に収まっても Word では 2 枚になるため
import sys,zipfile,re,shutil,os
F=1.42
def fix(path):
    zin=zipfile.ZipFile(path);items=[(i,zin.read(i.filename)) for i in zin.infolist()];zin.close()
    out=[]
    for info,data in items:
        if info.filename=='word/document.xml':
            x=data.decode('utf8')
            def para(m):
                p=m.group(0)
                if '<w:drawing' in p: return p
                sizes=[int(s) for s in re.findall(r'<w:sz w:val="(\d+)"',p)] or [19]
                sz=max(sizes)
                lm=re.search(r'<w:spacing([^>]*)/>',p)
                mult=1.0
                if lm:
                    a=lm.group(1);ln=re.search(r'w:line="(\d+)"',a);rule=re.search(r'w:lineRule="(\w+)"',a)
                    if rule and rule.group(1)!='auto': return p
                    if ln: mult=int(ln.group(1))/240
                tw=int(round(sz*10*F*max(mult,1.0)))
                if lm:
                    a=lm.group(1);a=re.sub(r'\s*w:line="\d+"','',a);a=re.sub(r'\s*w:lineRule="\w+"','',a)
                    return p.replace(lm.group(0),f'<w:spacing{a} w:line="{tw}" w:lineRule="exact"/>',1)
                if '<w:pPr>' in p: return p.replace('<w:pPr>',f'<w:pPr><w:spacing w:line="{tw}" w:lineRule="exact"/>',1)
                return re.sub(r'(<w:p(?:\s[^>]*)?>)',lambda mm:mm.group(1)+f'<w:pPr><w:spacing w:line="{tw}" w:lineRule="exact"/></w:pPr>',p,count=1)
            x=re.sub(r'<w:p(?:\s[^>]*)?>.*?</w:p>',para,x,flags=re.S)
            data=x.encode('utf8')
        out.append((info,data))
    tmp=path+'.tmp'
    with zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED) as z:
        for info,data in out:
            if info.filename.endswith('/'):continue
            z.writestr(info,data)
    os.replace(tmp,path)
for p in sys.argv[1:]: fix(p);print('fixed',os.path.basename(p))
