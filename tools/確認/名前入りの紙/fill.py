import sys,subprocess,glob,os,numpy as np,cv2
pdf=sys.argv[1];subprocess.run(['pdftoppm','-gray','-r','40',pdf,'fl'])
r=[]
for f in sorted(glob.glob('fl-*.pgm')):
    a=cv2.imread(f,0);h=a.shape[0];rows=np.where((a<200).sum(1)>0)[0];r.append(round(rows.max()/h*100));os.remove(f)
print('最も下まで使っているページ:',sorted(range(len(r)),key=lambda i:-r[i])[:6],'→',sorted(r)[-6:],'% （下の余白の境目はおよそ',round((16838-560)/16838*100),'%）')
