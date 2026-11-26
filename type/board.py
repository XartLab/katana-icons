import itertools, re, os
from stencil import text_svg, kan_svg
from glyphs import KAN
INK='#DCD8CC'; DIM='#6C706B'; BG='#0B0D0D'; KEY='{{key}}'
uid=itertools.count()
def T(s,size,color=INK,x=0,y=0,track=0.35,w=0.16):
    svg,width=text_svg(s,size,color,x,y,track=track,w_ratio=w,gid=f't{next(uid)}_'); return svg,width
def K(ch,size,color=INK,x=0,y=0): return kan_svg(ch,size,color,x,y,gid=f'k{next(uid)}_')
def hatch(x,y,w,h,color,step=9,sw=3):
    cid=f'h{next(uid)}'
    lines=''.join(f'<path d="M{x+i} {y+h}L{x+i+h} {y}"/>' for i in range(-h,w+h,step))
    return f'<clipPath id="{cid}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#{cid})" stroke="{color}" stroke-width="{sw}">{lines}</g>'
ICONS='/home/claude/katana-icons/packages/static/svg/line'
def icon(name,x,y,size,color=INK,sw=1.5):
    s=open(f'{ICONS}/{name}.svg').read()
    inner=re.sub(r'^<svg[^>]*>','',s).replace('</svg>','')
    return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="butt" stroke-linejoin="miter">{inner}</svg>'
def frame(x,y,w,h,c=INK,o=.35): return f'<rect x="{x+.5}" y="{y+.5}" width="{w-1}" height="{h-1}" fill="none" stroke="{c}" stroke-opacity="{o}"/>'
def ticks(x,y,w,n=40,c=INK):
    return ''.join(f'<rect x="{x+i*w/n:.1f}" y="{y-(7 if i%5==0 else 3)}" width="1" height="{7 if i%5==0 else 3}" fill="{c}" fill-opacity=".5"/>' for i in range(n+1))

W=1440; out=[]
# ---- header
s,_=T('KT STENCIL',64,INK,56,64); out.append(s)
out.append(K('刀',150,KEY,1234,40))
s,_=T('KATANA MONITOR TYPE · 01',14,DIM,56,160,w=.18); out.append(s)
# rules
rules=[('直线','只有横、竖、45° 斜线；圆角一律换成 45° 切角。'),('断桥','笔画相接的地方断开一道缝，封闭的腔断两处：漏字板喷出来的样子。'),('方头','线头切平，线宽统一，不做粗细变化。'),('单色高对比','屏幕上只有黑底和一种浅灰。'),('关键处上色','只有要人马上看见的数（价格、止损、警报）用一种颜色。'),('不画没意义的东西','每条线、每个刻度都得表示点什么。')]
rx=56
for i,(a,b) in enumerate(rules):
    x=56+i*222
    out.append(f'<text x="{x}" y="232" font-family="Zen Kaku Gothic New" font-weight="900" font-size="17" fill="{INK}">{a}</text>')
    words=b; lines=[words[j:j+15] for j in range(0,len(words),15)]
    for k,l in enumerate(lines): out.append(f'<text x="{x}" y="{258+k*20}" font-family="Zen Kaku Gothic New" font-size="12.5" fill="{INK}" fill-opacity=".65">{l}</text>')
out.append(f'<path d="M56 205H{W-56}" stroke="{INK}" stroke-opacity=".25"/>')
# ---- specimen
y0=340
s,_=T('ABCDEFGHIJKLMNOPQRSTUVWXYZ',40,INK,56,y0,track=.3); out.append(s)
s,_=T('0123456789 -/:.',40,INK,56,y0+70,track=.3); out.append(s)
s,_=T('LATIN 6X8 GRID · STROKE 0.16 CAP',11,DIM,860,y0+100,w=.2); out.append(s)
ks=list(KAN.keys())
for i,c in enumerate(ks): out.append(K(c,62,INK,56+i*78,y0+150))
s,_=T('KANJI 12X12 GRID · 16 GLYPHS',11,DIM,56,y0+240,w=.2); out.append(s)
out.append(f'<path d="M56 {y0+270}H{W-56}" stroke="{INK}" stroke-opacity=".25"/>')
# ---- layouts
ly=y0+300; pw=428; gap=22
# panel 1: order
x=56; out.append(frame(x,ly,pw,560))
out.append(f'<rect x="{x}" y="{ly}" width="{pw}" height="44" fill="{INK}" fill-opacity=".06"/>')
s,_=T('ORDER · KT-01',12,INK,x+18,ly+16,w=.2); out.append(s)
out.append(hatch(x+pw-120,ly+14,102,16,KEY))
out.append(K('上',120,KEY,x+18,ly+70))
s,_=T('LONG',40,INK,x+170,ly+92); out.append(s)
s,_=T('BTC-PERP',16,DIM,x+170,ly+150,w=.2); out.append(s)
s,_=T('68420.5',58,INK,x+18,ly+230,track=.22); out.append(s)
out.append(ticks(x+18,ly+320,pw-36))
rows=[('QTY','0.250'),('LEV','10X'),('SL','66900.0'),('TP','71800.0')]
for i,(a,b) in enumerate(rows):
    yy=ly+345+i*38; c=KEY if a=='SL' else INK
    s,_=T(a,14,DIM,x+18,yy,w=.2); out.append(s)
    s,wd=T(b,18,c,0,0); s2,_=T(b,18,c,x+pw-18-wd,yy); out.append(s2)
    out.append(f'<path d="M{x+18} {yy+28}H{x+pw-18}" stroke="{INK}" stroke-opacity=".12"/>')
out.append(f'<rect x="{x+18}" y="{ly+505}" width="{pw-36}" height="38" fill="{KEY}"/>')
s,wd=T('CONFIRM',16,BG,0,0); s2,_=T('CONFIRM',16,BG,x+pw/2-wd/2,ly+516); out.append(s2)
# panel 2: unit plate
x=56+pw+gap; out.append(frame(x,ly,pw,560))
for i,c in enumerate('一番機'): out.append(K(c,104,INK,x+22,ly+24+i*124))
s,_=T('KATANA',30,INK,x+160,ly+40); out.append(s)
s,_=T('UNIT 01 · WORKBENCH',12,DIM,x+160,ly+86,w=.2); out.append(s)
icons=['wallet','lock','power','bell','clock','settings','search','kt-watch']
for i,n in enumerate(icons):
    ix=x+160+(i%4)*62; iy=ly+130+(i//4)*76
    out.append(frame(ix,iy,50,50,INK,.25)); out.append(icon(n,ix+9,iy+9,32,KEY if n=='bell' else INK))
gauges=[('LINK',.92),('FEED',.71),('RISK',.38)]
for i,(a,v) in enumerate(gauges):
    gy=ly+320+i*58
    s,_=T(a,12,DIM,x+160,gy,w=.2); out.append(s)
    segs=20
    for k in range(segs):
        on=k<segs*v; out.append(f'<rect x="{x+160+k*12.4:.1f}" y="{gy+20}" width="9" height="14" fill="{(KEY if a=="RISK" else INK) if on else INK}" fill-opacity="{1 if on else .12}"/>')
out.append(hatch(x+160,ly+505,pw-178,22,INK,step=10,sw=3))
# panel 3: alert
x=56+2*(pw+gap); out.append(frame(x,ly,pw,560,KEY,.9))
out.append(hatch(x+1,ly+1,pw-2,30,KEY,step=14,sw=6))
out.append(hatch(x+1,ly+529,pw-2,30,KEY,step=14,sw=6))
out.append(K('止',170,KEY,x+28,ly+70))
s,_=T('STOP',44,KEY,x+230,ly+100); out.append(s)
s,_=T('TRIGGERED',16,INK,x+230,ly+160,w=.2); out.append(s)
for i,(a,b,c) in enumerate([('MARK','66897.5',INK),('STOP','66900.0',KEY),('LIQ','64100.0',INK)]):
    yy=ly+290+i*62
    s,_=T(a,14,DIM,x+28,yy+10,w=.2); out.append(s)
    s,wd=T(b,34,c,0,0); s2,_=T(b,34,c,x+pw-28-wd,yy); out.append(s2)
    out.append(f'<path d="M{x+28} {yy+50}H{x+pw-28}" stroke="{INK}" stroke-opacity=".15"/>')
out.append(icon('octagon-alert',x+28,ly+470,36,KEY,1.75))
s,_=T('POSITION CLOSED',12,INK,x+80,ly+482,w=.2); out.append(s)
# ---- icons section
iy=ly+600
out.append(f'<path d="M56 {iy}H{W-56}" stroke="{INK}" stroke-opacity=".25"/>')
out.append(f'<text x="56" y="{iy+40}" font-family="Zen Kaku Gothic New" font-weight="900" font-size="20" fill="{INK}">图标：用最早那套 ОКБ 机加工图标</text>')
out.append(f'<text x="56" y="{iy+66}" font-family="Zen Kaku Gothic New" font-size="13" fill="{INK}" fill-opacity=".65">平头、尖角、一道 45° 切角，跟这套字是同一种语言；放在屏幕里一律浅灰，只有要人看的那一个上色。</text>')
names=sorted(f[:-4] for f in os.listdir(ICONS))
for i,n in enumerate(names[:48]):
    cx=56+(i%16)*83; cy=iy+96+(i//16)*96
    out.append(frame(cx,cy,72,72,INK,.18))
    out.append(icon(n,cx+20,cy+14,32,KEY if n in('triangle-alert','zap') else INK))
    s,_=T(f'A{i+1:02d}',8,DIM,cx+6,cy+58,w=.2); out.append(s)
H=iy+96+3*96+40
svg=f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg" style="display:block"><rect width="{W}" height="{H}" fill="{BG}"/>{"".join(out)}</svg>'
html=f'''<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>KATANA 屏幕字</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;900&display=swap" rel="stylesheet">
<style>body{{margin:0}}</style>
</helmet>
<div style="width:{W}px;height:{H}px">{svg}</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"key":{{"editor":"color","default":"#E8572A","options":["#E8572A","#C8352E","#D6A548","#3FB8AF"]}},"$preview":{{"width":{W},"height":{H}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{ key: this.props.key ?? '#E8572A' }};
}}
}}
</script>
</body>
</html>'''
open('/home/claude/katana-logo/project/Monitor.dc.html','w').write(html)
open('/tmp/mon.html','w').write(html.replace('{{key}}','#E8572A').replace('<script src="./support.js"></script>',''))
print(H)
