/* ---------- 体の絵（2026-11-13）：場所・向き・測り方は、絵のほうが伝わる。線だけの簡単な絵で、正確な解剖図ではない ---------- */
const PIC=(h,ttl,inner)=>`<svg viewBox="0 0 340 ${h}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="8.3"><defs><marker id="pca" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#C0392B"/></marker></defs><text x="170" y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1F2A30">${ttl}</text>${inner}</svg>`;
const tx=(x,y,s,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'start'}" font-size="${o.z||8.3}" fill="${o.c||'#1F2A30'}"${o.b?' font-weight="700"':''}>${s}</text>`;};
const dot=(x,y,n,c)=>`<circle cx="${x}" cy="${y}" r="7" fill="${c||'#C0392B'}"/><text x="${x}" y="${y+3}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">${n}</text>`;
const SKIN='#F6E3D3',SKS='#B98B6B',BONE='#F3F0E6',BNS='#9C9480',MET='#6B7A80';

/* 膀胱内圧の測り方 */
SF('iah',2,PIC(246,'膀胱内圧の測り方',
 `<rect x="14" y="128" width="312" height="10" rx="3" fill="#DDE5EA"/>${tx(20,150,'ベッドは水平（頭を上げない）',{c:'#55666e',z:7.8})}
 <circle cx="50" cy="104" r="15" fill="${SKIN}" stroke="${SKS}"/>
 <path d="M66 96 Q110 78 170 84 Q215 86 232 98 L300 104 Q312 106 312 114 L312 128 L66 128 Z" fill="${SKIN}" stroke="${SKS}"/>
 <path d="M26 106 H326" stroke="#2F6FB0" stroke-width="1.4" stroke-dasharray="5 3"/>
 ${tx(326,100,'0 点',{a:'end',c:'#2F6FB0',b:1})}
 <ellipse cx="200" cy="112" rx="15" ry="9" fill="#FFF3C4" stroke="#B37A00"/>${tx(200,115,'膀胱',{a:'middle',z:7.5,c:'#6B4A00'})}
 <path d="M214 114 Q250 122 262 106 L262 60" stroke="#B37A00" stroke-width="2" fill="none"/>
 <rect x="252" y="42" width="20" height="18" rx="3" fill="#E3EEF9" stroke="#2F6FB0"/>${tx(262,36,'圧を測る器具',{a:'middle',z:7.8,c:'#2F6FB0'})}
 <path d="M252 106 H272" stroke="#2F6FB0" stroke-width="1.6"/>
 <rect x="282" y="66" width="34" height="9" rx="2" fill="#fff" stroke="${MET}"/><path d="M272 70 H282" stroke="${MET}" stroke-width="1.5"/>${tx(299,62,'生理食塩液',{a:'middle',z:7.6})}${tx(299,86,'25 mL まで',{a:'middle',z:7.6,b:1,c:'#C0392B'})}
 <path d="M150 70 V84" stroke="#C0392B" stroke-width="1.2" marker-end="url(#pca)"/>${tx(150,64,'腸骨稜（腰骨の上の縁）の高さ',{a:'middle',z:7.8,c:'#8E2A20'})}
 ${tx(14,36,'① あおむけ・水平にする',{b:1})}${tx(14,48,'② 0 点＝わきの下の中央の線（中腋窩線）',{b:1})}
 <rect x="8" y="160" width="324" height="80" rx="6" fill="#F6F9FA" stroke="#DCE4E8"/>
 ${tx(16,175,'③ 膀胱を空にして、生理食塩液を 25 mL までで入れる（多いと高く出る）')}
 ${tx(16,188,'④ 30〜60 秒待ち、息を吐き終わったときの値を mmHg で読む')}
 ${tx(16,201,'⑤ 咳・痛み・体動・呼吸器と合わないときは、正しく測れない')}
 ${tx(16,216,'⑥ 12 mmHg 以上が続く＝腹腔内圧上昇。20 超＋臓器の障害＝ACS',{c:'#8E2A20',b:1})}
 ${tx(16,230,'入れた生理食塩液の量は、尿量から引く',{z:7.6,c:'#55666e'})}`));

/* 足の脈を触れる場所 */
SF('ali',4,PIC(214,'足の脈を触れる場所',
 `${tx(86,34,'足の甲（上から見た右足）',{a:'middle',b:1})}
 <path d="M58 170 Q52 120 62 86 Q66 60 80 52 Q104 44 116 66 Q124 96 118 130 Q116 160 108 174 Q84 186 58 170 Z" fill="${SKIN}" stroke="${SKS}"/>
 <ellipse cx="72" cy="50" rx="7" ry="9" fill="${SKIN}" stroke="${SKS}"/><ellipse cx="87" cy="44" rx="5.5" ry="8" fill="${SKIN}" stroke="${SKS}"/><ellipse cx="99" cy="46" rx="5" ry="7" fill="${SKIN}" stroke="${SKS}"/><ellipse cx="109" cy="51" rx="4.5" ry="6" fill="${SKIN}" stroke="${SKS}"/><ellipse cx="117" cy="59" rx="4" ry="5" fill="${SKIN}" stroke="${SKS}"/>
 <path d="M80 60 Q84 100 88 150" stroke="#C0392B" stroke-width="2" fill="none" stroke-dasharray="3 2"/>
 ${dot(85,108,'1')}
 ${tx(254,34,'内くるぶし（内側から見た右足）',{a:'middle',b:1})}
 <path d="M230 44 L262 44 L266 120 Q268 134 282 140 L318 150 Q328 154 326 164 L324 172 L214 172 Q206 172 208 162 Q214 138 228 126 Z" fill="${SKIN}" stroke="${SKS}"/>
 <circle cx="248" cy="128" r="9" fill="${BONE}" stroke="${BNS}"/>${tx(248,131,'骨',{a:'middle',z:7})}
 <path d="M240 50 Q232 100 232 128 Q234 150 250 160" stroke="#C0392B" stroke-width="2" fill="none" stroke-dasharray="3 2"/>
 ${dot(231,134,'2')}
 <rect x="8" y="180" width="324" height="30" rx="6" fill="#F6F9FA" stroke="#DCE4E8"/>
 ${dot(20,190,'1')}${tx(32,193,'足背動脈：親指と人さし指の間を、足首のほうへたどった所')}
 ${dot(20,203,'2')}${tx(32,206,'後脛骨動脈：内くるぶしの後ろ。触れなければドプラ。触れた所に印をつける')}`));

/* 腹のドレーンの場所 */
SF('peritonitis',3,PIC(262,'腹のドレーンが置かれる場所（あおむけで液がたまる所）',
 `<path d="M110 30 Q170 22 230 30 Q246 80 244 130 Q244 190 222 226 Q170 240 118 226 Q96 190 96 130 Q94 80 110 30 Z" fill="${SKIN}" stroke="${SKS}" stroke-width="1.3"/>
 <path d="M106 62 Q140 40 170 54 Q200 40 234 62" stroke="#8A6E5A" stroke-width="1.6" fill="none"/>${tx(170,48,'横隔膜',{a:'middle',z:7.5,c:'#6B5444'})}
 <path d="M110 68 Q140 54 176 66 Q168 96 132 100 Q112 96 110 68 Z" fill="#C98B6B" opacity=".55" stroke="#8A5A40"/>${tx(138,84,'肝臓',{a:'middle',z:8,c:'#5A2E18',b:1})}
 <path d="M186 70 Q214 62 226 80 Q222 104 198 104 Q184 92 186 70 Z" fill="#E7C7B0" stroke="#8A5A40"/>${tx(206,88,'胃',{a:'middle',z:8,c:'#5A2E18'})}
 <ellipse cx="232" cy="92" rx="7" ry="11" fill="#B77A8A" opacity=".6" stroke="#7A4050"/>${tx(252,95,'脾臓',{z:7.5,c:'#7A4050'})}
 <path d="M116 112 V186 M224 112 V186 M116 112 H224" stroke="#B9A07A" stroke-width="9" fill="none" stroke-linecap="round" opacity=".55"/>${tx(170,115,'大腸',{a:'middle',z:7.5,c:'#6B5A30'})}
 <path d="M134 196 Q170 232 206 196" stroke="#8A6E5A" stroke-width="1.4" fill="none"/>${tx(170,236,'骨盤',{a:'middle',z:7.5,c:'#6B5444'})}
 ${dot(122,58,'1')}${dot(218,58,'2')}${dot(150,106,'3')}${dot(104,150,'4')}${dot(236,150,'5')}${dot(170,208,'6')}
 ${tx(8,40,'（体の右）',{z:7.5,c:'#55666e'})}${tx(332,40,'（体の左）',{a:'end',z:7.5,c:'#55666e'})}
 ${tx(8,66,'1 右の横隔膜の下',{z:7.9})}${tx(8,112,'3 肝臓の下',{z:7.9})}${tx(8,122,'（ウィンスロー孔）',{z:7.3,c:'#55666e'})}${tx(8,166,'4 右のわき',{z:7.9})}${tx(8,176,'（傍結腸溝）',{z:7.3,c:'#55666e'})}
 ${tx(332,74,'2 左の横隔膜の下',{a:'end',z:7.9})}${tx(332,166,'5 左のわき',{a:'end',z:7.9})}${tx(332,176,'（傍結腸溝）',{a:'end',z:7.3,c:'#55666e'})}
 ${tx(170,254,'6 骨盤の底（ダグラス窩）：いちばん低く、液と膿がたまりやすい',{a:'middle',z:7.9,c:'#8E2A20',b:1})}`));

/* 創外固定の型 */
SF('exfix',0,PIC(206,'創外固定の型',
 `${tx(58,32,'片側の棒で支える型',{a:'middle',b:1})}
 <rect x="50" y="42" width="16" height="56" rx="6" fill="${BONE}" stroke="${BNS}"/><rect x="50" y="104" width="16" height="56" rx="6" fill="${BONE}" stroke="${BNS}"/>
 <path d="M48 99 L68 103" stroke="#C0392B" stroke-width="1.6"/>
 <path d="M58 56 H96 M58 80 H96 M58 122 H96 M58 146 H96" stroke="${MET}" stroke-width="2.2"/>
 <rect x="92" y="46" width="7" height="110" rx="3" fill="#8FA3AD" stroke="#55666e"/>
 ${tx(58,174,'ピン',{a:'middle',z:7.6,c:'#55666e'})}${tx(104,174,'棒',{z:7.6,c:'#55666e'})}
 ${tx(170,32,'輪で囲む型（リング）',{a:'middle',b:1})}
 <rect x="162" y="42" width="16" height="56" rx="6" fill="${BONE}" stroke="${BNS}"/><rect x="162" y="104" width="16" height="56" rx="6" fill="${BONE}" stroke="${BNS}"/>
 <path d="M160 99 L180 103" stroke="#C0392B" stroke-width="1.6"/>
 <ellipse cx="170" cy="62" rx="34" ry="9" fill="none" stroke="#55666e" stroke-width="2.2"/><ellipse cx="170" cy="140" rx="34" ry="9" fill="none" stroke="#55666e" stroke-width="2.2"/>
 <path d="M138 58 L202 66 M138 66 L202 58 M138 136 L202 144 M138 144 L202 136" stroke="${MET}" stroke-width="1"/>
 <path d="M138 62 V140 M202 62 V140" stroke="#8FA3AD" stroke-width="3"/>
 ${tx(170,174,'細いワイヤーを輪に張る',{a:'middle',z:7.6,c:'#55666e'})}
 ${tx(282,32,'骨盤の創外固定',{a:'middle',b:1})}
 <path d="M240 70 Q246 52 268 60 Q282 66 282 84 Q282 66 296 60 Q318 52 324 70 Q326 100 304 116 Q290 126 282 110 Q274 126 260 116 Q238 100 240 70 Z" fill="${BONE}" stroke="${BNS}"/>
 <path d="M254 66 L262 132 M310 66 L302 132" stroke="${MET}" stroke-width="2.2"/>
 <path d="M258 132 H306" stroke="#8FA3AD" stroke-width="6" stroke-linecap="round"/>
 ${tx(282,150,'腹の前に棒がある',{a:'middle',z:7.6,c:'#55666e'})}${tx(282,160,'起こす角度に注意',{a:'middle',z:7.6,c:'#8E2A20'})}
 <rect x="8" y="182" width="324" height="20" rx="6" fill="#F6F9FA" stroke="#DCE4E8"/>
 ${tx(170,195,'ピンの根元が感染の入口。枠を持って動かしてよいかは、医師に確かめる',{a:'middle',z:7.7})}`));

/* 胆道ドレナージ */
SF('cholangitis',2,PIC(250,'胆汁を外に出す 3 つの方法',
 `<path d="M70 52 Q130 30 210 44 Q236 56 228 86 Q200 108 150 104 Q96 108 72 90 Q60 70 70 52 Z" fill="#C98B6B" opacity=".5" stroke="#8A5A40"/>${tx(120,66,'肝臓',{a:'middle',b:1,c:'#5A2E18'})}
 <path d="M130 80 Q150 92 160 110 M190 78 Q172 92 160 110 M160 110 V170" stroke="#3E8E5A" stroke-width="5" fill="none" stroke-linecap="round"/>${tx(166,146,'胆管',{z:7.8,c:'#1B5E20'})}
 <ellipse cx="128" cy="122" rx="10" ry="16" fill="#9CCB9A" stroke="#3E8E5A" transform="rotate(20 128 122)"/>${tx(100,128,'胆嚢',{a:'end',z:7.8,c:'#1B5E20'})}<path d="M136 112 Q150 110 160 124" stroke="#3E8E5A" stroke-width="3" fill="none"/>
 <path d="M150 168 Q190 160 216 172 Q236 184 228 202 Q200 214 168 204 Q146 190 150 168 Z" fill="#E7C7B0" stroke="#8A5A40"/>${tx(196,192,'十二指腸',{a:'middle',z:7.8,c:'#5A2E18'})}
 <path d="M228 180 Q262 160 268 120 Q270 90 258 70" stroke="#8A5A40" stroke-width="7" fill="none" opacity=".35" stroke-linecap="round"/>${tx(280,126,'胃',{z:7.8,c:'#5A2E18'})}
 <path d="M258 70 Q250 44 252 24" stroke="#8A5A40" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>${tx(262,34,'食道 → 鼻へ',{z:7.8,c:'#5A2E18'})}
 <path d="M160 150 V172 Q176 186 214 178 Q260 164 266 120 Q268 90 256 68 Q248 44 250 24" stroke="#2F6FB0" stroke-width="1.8" fill="none"/>
 ${dot(250,24,'1','#2F6FB0')}
 <path d="M160 132 V166" stroke="#7E57C2" stroke-width="3.2" fill="none"/>${dot(160,158,'2','#7E57C2')}
 <path d="M22 84 Q60 78 96 84 Q120 88 140 86" stroke="#C0392B" stroke-width="1.8" fill="none"/>${dot(22,84,'3')}
 ${tx(22,104,'皮膚（右のわき腹）',{z:7.5,c:'#8E2A20'})}
 <rect x="8" y="214" width="324" height="32" rx="6" fill="#F6F9FA" stroke="#DCE4E8"/>
 ${dot(20,223,'1','#2F6FB0')}${tx(32,226,'ENBD：内視鏡で入れ、鼻から外へ。鼻の所の長さの印を確かめる',{z:7.8})}
 ${dot(20,237,'2','#7E57C2')}${tx(32,240,'ステント（体の中）',{z:7.8})}${dot(118,237,'3')}${tx(130,240,'PTBD：皮膚から肝臓を通す。抜けると胆汁性腹膜炎',{z:7.8})}`));

/* 腓骨神経麻痺を防ぐ足の向き（上から見た図） */
SF('hip_fx',2,PIC(226,'足の向きと、腓骨神経の圧迫（上から見た両足）',
 `${tx(90,32,'○ つま先が上を向く',{a:'middle',b:1,c:'#2E7D32'})}${tx(250,32,'× 足が外に倒れる',{a:'middle',b:1,c:'#C0392B'})}
 <rect x="30" y="40" width="120" height="150" rx="8" fill="#EEF3F6"/><rect x="190" y="40" width="120" height="150" rx="8" fill="#EEF3F6"/>
 <path d="M72 44 H108 L102 160 H78 Z" fill="${SKIN}" stroke="${SKS}"/>
 <circle cx="90" cy="100" r="10" fill="${BONE}" stroke="${BNS}"/>${tx(90,103,'皿',{a:'middle',z:7.2})}
 <ellipse cx="90" cy="168" rx="11" ry="8" fill="${SKIN}" stroke="${SKS}"/>
 ${tx(112,84,'皿が真上',{z:7.5,c:'#2E7D32'})}${tx(90,186,'つま先が天井を向く',{a:'middle',z:7.5,c:'#55666e'})}
 <path d="M232 44 H268 L266 160 H242 Z" fill="${SKIN}" stroke="${SKS}"/>
 <circle cx="262" cy="100" r="10" fill="${BONE}" stroke="${BNS}"/>${tx(262,103,'皿',{a:'middle',z:7.2})}
 <ellipse cx="272" cy="168" rx="20" ry="8" fill="${SKIN}" stroke="${SKS}"/>
 <circle cx="270" cy="118" r="6" fill="#C0392B"/>
 <path d="M298 88 L278 113" stroke="#C0392B" stroke-width="1.4" marker-end="url(#pca)"/>
 ${tx(196,62,'皿が外を向く',{z:7.5,c:'#8E2A20'})}
 ${tx(306,72,'腓骨頭',{a:'end',z:7.8,c:'#8E2A20',b:1})}${tx(306,82,'（ここが押される）',{a:'end',z:7.3,c:'#8E2A20'})}
 ${tx(250,186,'足が外に倒れる',{a:'middle',z:7.5,c:'#55666e'})}
 <rect x="8" y="196" width="324" height="26" rx="6" fill="#F6F9FA" stroke="#DCE4E8"/>
 ${tx(16,207,'腓骨頭（ひざの外側の出っぱり）を神経が通る。押されると、足首が上がらない',{z:7.6})}
 ${tx(16,218,'毎勤務、足首と親指を上に反らせるか、足の甲の感覚を確かめる',{z:7.6,c:'#8E2A20',b:1})}`));
