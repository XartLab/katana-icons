// SPDX-License-Identifier: MIT
// KATANA 宠物（玩具）：くるみ、芽吹、やす子、萌智子，跟着盈亏换表情、动作和台词。
// 角色原图由团队用 GPT 生成（pets/source/），scripts/build-pets.py 还原原生像素网格并写出 sprites.js。
// 用法：
//   import { mountPet, moodFromPnl } from '@katana-icons/pets'
//   const pet = mountPet(canvasEl, { pet: 'kurumi', onState: (s) => { banner.textContent = s.banner; dialog.textContent = s.line } })
//   pet.setMood(moodFromPnl(-4.2))   // 或直接 pet.setMood('scream')
//   pet.shock()                       // 急跌：惊呆约 2 秒，打断一切
//   pet.setTalking(true)              // 台词打字时嘴会动
//   pet.destroy()
// 画布原生 96×52 像素；CSS 放大时用 image-rendering: pixelated。
import { SPRITES } from './sprites.js';

const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPR = SPRITES;
// ---------- face templates ----------
// k skin, T eye top, W white, I iris, D line, B blush, M mouth dark, R mouth red, G tongue, S tear, '.' keep original
const T10={
 calm:['TTTkkkkTTT','WIWkkkkWIW','WIWkkkkWIW','WWWkkkkWWW','BBkkkkkkBB','kkkkDDkkkk','kkkkkkkkkk'],
 focus:['DDDkkkkDDD','@@@kkkk@@@','kkkkkkkkkk','kkkkkkkkkk','kkkkkkkkkk','kkkDDDDkkk','kkkkkkkkkk'],
 happy:['kkkkkkkkkk','kDkkkkkkDk','DkDkkkkDkD','kkkMMMMkkk','BBkMRRMkBB','kkkkMMkkkk','kkkkkkkkkk'],
 smug:['kkkkkkkkkk','DDDkkkkDDD','WWIkkkkWWI','kkkkkkkkkk','BBkkkkDkBB','kkkkDDkkkk','kkkkkkkkkk'],
 loss:['TTTkkkkTTT','WWWkkkkWWW','WIWkkkkWIW','WIWkkkkWIW','kkkkkkkkkk','kkkkDkDkkk','kkkDkDkkkk'],
 shock:['TTTkkkkTTT','WWWkkkkWWW','WIWkkkkWIW','WWWkkkkWWW','kkkkkkkkkk','kkkkMMkkkk','kkkkMMkkkk'],
 scream:['kkkkkkkkkk','DkkkkkkkkD','kDkMMMMkDk','DkkMRRMkkD','BBkMRRMkBB','kkkMGGMkkk','kkkkMMkkkk'],
 despair:['TTTkkkkTTT','WWWkkkkWWW','WWWkMMkWWW','WWWMRRMWWW','kSkMRRMkSk','kSkkMMkkSk','kSkkkkkkSk'],
 sleep:['kkkkkkkkkk','kkkkkkkkkk','DkDkkkkDkD','kDkkkkkkDk','BBkkkkkkBB','kkkkDDkkkk','kkkkkkkkkk']
};
const T11={
 calm:['DDDD...DDDD','TIIW...WIIT','kkkk...kkkk','kBBkkkkkBBk','kkkkkkkkkkk','kkkkDDkkkkk','kkkkkkkkkkk'],
 focus:['DDDD...DDDD','@@@@...@@@@','kkkk...kkkk','kkkkkkkkkkk','kkkkkkkkkkk','kkkDDDDkkkk','kkkkkkkkkkk'],
 happy:['kkkk...kkkk','kDDk...kDDk','DkkD...DkkD','kBBkkkkkBBk','kkkMMMMkkkk','kkkMRRMkkkk','kkkkMMkkkkk'],
 smug:['DDDD...DDDD','WWII...WWII','kkkk...kkkk','kBBkkkkkBBk','kkkkkkDkkkk','kkkkDDkkkkk','kkkkkkkkkkk'],
 loss:['DDDD...DDDD','WWWW...WWWW','WIIW...WIIW','kkkkkkkkkkk','kkkkDkDkkkk','kkkDkDkkkkk','kkkkkkkkkkk'],
 shock:['TTTT...TTTT','WWWW...WWWW','WWIW...WIWW','kWWkkkkkWWk','kkkkkkkkkkk','kkkkMMkkkkk','kkkkMMkkkkk'],
 scream:['DDkk...kkDD','kkDD...DDkk','DDkk...kkDD','kBBkkkkkBBk','kkMMMMMMkkk','kkMRRRRMkkk','kkkMGGMkkkk'],
 despair:['TTTT...TTTT','WWWW...WWWW','WWWW...WWWW','kSkkkkkkkSk','kSkMMMMkkSk','kSkMRRMkkSk','kSkkMMkkkSk'],
 sleep:['kkkk...kkkk','DkkD...DkkD','kDDk...kDDk','kBBkkkkkBBk','kkkkkkkkkkk','kkkkDDkkkkk','kkkkkkkkkkk']
};
const SHAPE={10:{eyes:[[0,1,2],[7,8,9]],eyeRows:[0,1,2,3],blinkRow:2,mouthCols:[3,4,5,6]},
             11:{eyes:[[0,1,2,3],[7,8,9,10]],eyeRows:[0,1,2],blinkRow:1,mouthCols:[2,3,4,5,6,7]}};
const R=(a,b)=>{const o=[];for(let i=a;i<=b;i++)o.push(i);return o};
const PETS=[
 {id:'kurumi',name:'くるみ',role:'盯盘',desc:'粉发。一直盯着图，利润一缩水就第一个慌。原图的脸用在「绝叫」。',orig:'scream',
  tpl:10,ox:6,oy:10,mask:{10:R(6,15),11:R(6,15),12:R(6,15),13:R(6,15),14:R(6,15),15:R(6,15),16:R(7,14)},
  pal:{k:'#f9e6d5',T:'#94b1cf',W:'#ffffff',I:'#a0266f',D:'#0b0507',B:'#e4b5b0',M:'#8f484c',R:'#a33332',G:'#d0706f',S:'#7cc8ff'}},
 {id:'mebuki',name:'芽吹',role:'仓位与保证金',desc:'金发。满仓高杠杆的那个，强平线离得最近。原图的脸用在「爆仓」。',orig:'despair',
  tpl:10,ox:6,oy:10,mask:{10:[7,8,13,14],11:[6,7,8,13,14,15],12:R(6,15),13:R(6,15),14:R(6,15),15:R(6,15),16:R(7,14)},
  pal:{k:'#fbebde',T:'#94b1cf',W:'#ffffff',I:'#c9b52c',D:'#0b0507',B:'#efc3b4',M:'#891b28',R:'#b9464f',G:'#e08a8a',S:'#7cc8ff'}},
 {id:'yasuko',name:'やす子',role:'情绪与行情',desc:'兔耳。行情一动就对着 K 线吼。原图的脸用在「绝叫」。',orig:'scream',
  tpl:10,ox:8,oy:11,mask:{11:[8,9,10,15,16,17],12:[8,9,10,15,16,17],13:R(8,17),14:R(8,17),15:R(8,17),16:R(8,17),17:R(9,16)},
  pal:{k:'#fbe8da',T:'#94b1cf',W:'#ffffff',I:'#821b36',D:'#0b0507',B:'#e9b8b0',M:'#6e1624',R:'#a32436',G:'#d0707a',S:'#7cc8ff'}},
 {id:'mochiko',name:'萌智子',role:'风控与复盘',desc:'紫发。冷眼看你乱操作，开口就是吐槽。原图的脸用在「冒汗」。',orig:'loss',
  tpl:11,ox:5,oy:11,mask:{11:[5,6,7,8,12,13,14,15],12:[5,6,7,8,12,13,14,15],13:[5,6,7,8,12,13,14,15],14:[5,6,7,8,9,11,12,13,14],15:R(5,14),16:R(6,13),17:R(8,11)},
  pal:{k:'#f9e6d8',T:'#94b0cf',W:'#ffffff',I:'#42266b',D:'#0b0507',B:'#e2b3b0',M:'#251d35',R:'#8a3550',G:'#c06a80',S:'#7cc8ff'}}
];
const MOODS=[['calm','平静'],['focus','盯盘'],['happy','狂喜'],['smug','得意'],['loss','冒汗'],['shock','惊呆'],['scream','绝叫'],['despair','爆仓'],['sleep','打盹']];
const L={
 kurumi:{calm:['様子を見ている','チャート、見てるよ……'],focus:['監視している','じーっ……'],happy:['喜んでいる','利益きた……！！'],smug:['得意げだ','ふふ、計画通り。'],loss:['焦っている','あれ、含み損……？'],shock:['固まっている','えっ、今の何！？'],scream:['負けている','利益どこいった……！？'],despair:['泣いている','口座が……からっぽ……'],sleep:['眠っている','すぅ……すぅ……']},
 mebuki:{calm:['待機している','ポジション、異常なし。'],focus:['監視している','証拠金維持率、チェック中。'],happy:['浮かれている','上がれ上がれ〜！'],smug:['調子に乗っている','レバ100倍は正義。'],loss:['青ざめている','証拠金……足りる？'],shock:['固まっている','ちょ、ヒゲ長っ！？'],scream:['混乱している','追証！？追証って何！？'],despair:['絶望している','0.1円でも上がったら強制ロスカット…！？'],sleep:['うなされている','ロスカットの夢見てる……']},
 yasuko:{calm:['にらんでいる','動けェ……動けェ……'],focus:['監視している','板、見てんぞォ……'],happy:['勝ち誇っている','ほら見ろォ！上げたァ！！'],smug:['ドヤっている','アタシの読み通りだろォ？'],loss:['怒っている','下げんなって言ってんだろォ！'],shock:['固まっている','はァ！？なんだ今の！？'],scream:['絶叫している','上げんなら、下げんなヤァ！！！'],despair:['燃え尽きている','もう……知らん……'],sleep:['寝ている','……起こすなよォ……']},
 mochiko:{calm:['見下している','……で？'],focus:['監視している','黙って見てなさい。'],happy:['照れている','……べ、別に嬉しくないし。'],smug:['すましている','ふーん、まあ当然でしょ。'],loss:['呆れている','バッッカじゃねーの！？'],shock:['固まっている','……は？'],scream:['キレている','は？は？は？！何この下げ！！'],despair:['黙り込んでいる','……全部、あんたのせいだから。'],sleep:['寝ている','……くー。']}
};
const CW = 44, CH = 50, BASE = {};

// ---------- face painter ----------
// ---------- face painter ----------
function faceRows(p,mood,o){
  const sh=SHAPE[p.tpl];let rows=(p.tpl===10?T10:T11)[mood].map(r=>r.split(''));
  if(mood==='focus'){const n=sh.eyes[0].length,pos=o.look??1;
    const eye=n===3?['IWW','WIW','WWI'][pos]:['IIWW','WIIW','WWII'][pos];
    sh.eyes.forEach(cols=>cols.forEach((c,i)=>rows[1][c]=eye[i]))}
  if(o.blink&&['calm','focus','smug','loss','shock'].includes(mood)){
    sh.eyes.forEach(cols=>cols.forEach(c=>sh.eyeRows.forEach(r=>rows[r][c]=r===sh.blinkRow?'D':'k')))}
  if(o.talk){
    const open=rows.some(r=>sh.mouthCols.some(c=>'RG'.includes(r[c])));
    if(open){let last=-1;rows.forEach((r,i)=>{if(sh.mouthCols.some(c=>'MRG'.includes(r[c])))last=i});
      if(last>0){sh.mouthCols.forEach(c=>{if('MRG'.includes(rows[last][c]))rows[last][c]='k';if('RG'.includes(rows[last-1][c]))rows[last-1][c]='M'})}}
    else{const c0=p.tpl===10?4:4;rows[5][c0]='M';rows[5][c0+1]='M';rows[6][c0]='R';rows[6][c0+1]='R'}}
  return rows;
}
function paint(p,mood,o={}){
  const b=BASE[p.id],c=document.createElement('canvas');c.width=b.width;c.height=b.height;
  const g=c.getContext('2d');g.drawImage(b,0,0);
  if(mood!==p.orig||o.forceFace){
    const rows=faceRows(p,mood,o);
    rows.forEach((r,ri)=>{const y=p.oy+ri,m=p.mask[y];if(!m)return;
      r.forEach((ch,ci)=>{const x=p.ox+ci;if(ch==='.'||!m.includes(x))return;g.fillStyle=p.pal[ch]||p.pal.k;g.fillRect(x,y,1,1)})});
  }else if(o.talk&&mood===p.orig){/* original face: no repaint */}
  if(mood==='despair'){const d=g.getImageData(0,0,c.width,c.height),a=d.data;
    for(let i=0;i<a.length;i+=4){const l=.3*a[i]+.59*a[i+1]+.11*a[i+2];a[i]=(a[i]*.35+l*.65)*.8;a[i+1]=(a[i+1]*.35+l*.65)*.8;a[i+2]=(a[i+2]*.35+l*.65)*.88}
    g.putImageData(d,0,0)}
  return c;
}

// ---------- rig: arms / head / body / legs ----------
const RIG={
 kurumi:{split:18,legY:29,legX:11,erase:[[0,12,4,17],[17,12,21,17]],sh:[[5,18],[16,18]],col:{o:'#0b0507',s:'#f6f0f6',k:'#f6e4d2',c:'#c69696',cuff:'#963666'},def:'pray'},
 mebuki:{split:18,legY:29,legX:11,erase:[[2,22,5,27],[16,23,19,27]],sh:[[6,22],[15,22]],col:{o:'#0b0507',s:'#f0f0e4',k:'#f6ead8',c:'#cc9c9c'},def:'hips'},
 yasuko:{split:19,legY:28,legX:12,erase:[[2,19,7,23],[17,19,22,23]],sh:[[8,21],[16,21]],col:{o:'#0b0507',s:'#24242a',k:'#f6e4d8',c:'#d2d2d2'},def:'spread'},
 mochiko:{split:19,legY:29,legX:10,erase:[],sh:[null,[14,21]],col:{o:'#0b0507',s:'#423054',k:'#f6e4d8',c:'#121230'},def:'down'}
};
// left-arm coords [elbowX, elbowY, handX, handY] relative to shoulder; negative x = outward
const AP={down:[-1,3,-1,6],clasp:[1,4,4,5],hips:[-3,2,-1,5],up:[-2,-3,-3,-6],up2:[-2,-3,-2,-7],spread:[-2,0,-4,1],spread2:[-2,-1,-4,-1],
 cheek:[-1,-1,1,-4],cheek2:[-1,-1,1,-3],head:[-2,-3,0,-7],cross:[1,3,5,2],point:[-3,-1,-6,-2],point2:[-3,-1,-7,-3],fist:[-1,-3,-1,-6],fist2:[-1,-2,-1,-4],
 chin:[1,3,4,-1],limp:[-1,4,-1,7],wave1:[-2,-3,-2,-6],wave2:[-2,-3,-4,-5],startle:[-3,-2,-4,-4],swingA:[-1,3,1,5],swingB:[-1,3,-3,5],
 face:[2,2,5,-5],hair:[-3,-2,-2,-7],shrug:[-3,0,-4,-3],pray:[0,2,3,-2],eyes:[1,1,3,-6]};
function line(x0,y0,x1,y1){const p=[];let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
  for(;;){p.push([x0,y0]);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}return p}
function drawArms(g,arms,col){
  const segs=arms.map(a=>{const[sx,sy,v]=a,m=a[3];const E=[sx+v[0]*m,sy+v[1]],H=[sx+v[2]*m,sy+v[3]];
    return{up:line(sx,sy,E[0],E[1]),lo:line(E[0],E[1],H[0],H[1]),H}});
  g.fillStyle=col.o;
  segs.forEach(s=>{[...s.up,...s.lo].forEach(([x,y])=>{g.fillRect(x-1,y,3,1);g.fillRect(x,y-1,1,3)});g.fillRect(s.H[0]-1,s.H[1]-1,4,4)});
  segs.forEach(s=>{g.fillStyle=col.s;s.up.forEach(([x,y])=>g.fillRect(x,y,1,1));s.lo.forEach(([x,y],i)=>{const n=s.lo.length;g.fillStyle=i>=n-2?col.k:(col.cuff&&i===n-3?col.cuff:col.s);g.fillRect(x,y,1,1)});
    g.fillStyle=col.k;g.fillRect(s.H[0],s.H[1],2,2);g.fillStyle=col.c;g.fillRect(s.H[0],s.H[1]+1,1,1)});
}
function prepared(p,mood,o){
  const c=paint(p,mood,o),g=c.getContext('2d'),r=RIG[p.id];if(!r.erase.length||o.orig)return c;
  const d=g.getImageData(0,0,c.width,c.height),a=d.data,W=c.width,H=c.height,cut=new Set();
  r.erase.forEach(([x0,y0,x1,y1])=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=W||y>=H)continue;a[(y*W+x)*4+3]=0;cut.add(y*W+x)}});
  cut.forEach(k=>{const x=k%W,y=(k-x)/W;const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)return false;const j=(ny*W+nx)*4;return a[j+3]>0&&!cut.has(ny*W+nx)&&(a[j]+a[j+1]+a[j+2])>60});
    if(nb){const j=k*4;a[j]=11;a[j+1]=5;a[j+2]=7;a[j+3]=255}});
  g.putImageData(d,0,0);return c;
}
// ---------- acts (behaviour vocabulary) ----------
const ACTS={
 breathe:{n:'呼吸',d:[20,30],f:(t,a)=>({dyBody:t%10<5?0:1,tilt:a.tilt||0})},
 look:{n:'东张西望',d:[18,24],f:t=>({tilt:t<5?0:t<11?-1:t<17?1:0,dyBody:t%10<5?0:1})},
 walk:{n:'走来走去',d:[18,30],walk:.5,f:(t)=>{const ph=t%4;return{lift:[ph===0?1:0,ph===2?1:0],dyBody:ph%2,L:ph<2?'swingA':'swingB',R:ph<2?'swingB':'swingA'}}},
 pace:{n:'来回踱步',d:[16,24],walk:1,f:(t)=>{const ph=t%4;return{lift:[ph===0?1:0,ph===2?1:0],dyBody:ph%2,L:'head',R:'head'}}},
 run:{n:'抱头乱跑',d:[16,22],walk:1.5,f:(t,a)=>{const ph=t%2;return{lift:[ph,1-ph],dyAll:-ph,L:a.arms||'up',R:a.arms||'up'}}},
 hop:{n:'蹦跳',d:[16,24],f:t=>({dyAll:[0,-2,-4,-5,-4,-2,0,0][t%8],L:'up',R:'up'})},
 banzai:{n:'万岁',d:[20,28],f:t=>({L:t%4<2?'up':'up2',R:t%4<2?'up2':'up',dyAll:t%8<2?-2:0})},
 fistpump:{n:'握拳',d:[16,24],f:t=>({R:t%4<2?'fist':'fist2',dyAll:t%4<2?-1:0})},
 wave:{n:'挥手',d:[16,22],f:t=>({R:t%4<2?'wave1':'wave2',tilt:1})},
 cheeks:{n:'双手捧脸',d:[20,30],f:(t,a)=>({L:t%4<2?'cheek':'cheek2',R:t%4<2?'cheek2':'cheek',tilt:t%12<6?-1:1,dx:a.shake?(t%2?1:-1):0})},
 hugself:{n:'抱紧自己',d:[20,28],f:t=>({L:'cross',R:'cross',dx:t%3===0?1:0,dyBody:1})},
 headhold:{n:'抱头',d:[20,28],f:(t,a)=>({L:'head',R:'head',tilt:t%10<5?-1:1,dx:a.shake?(t%2?1:-1):0})},
 stomp:{n:'跺脚',d:[14,20],f:t=>{const ph=t%6;return{lift:[ph<2?2:0,ph>=3&&ph<5?2:0],dyAll:ph===2||ph===5?1:0,L:'fist2',R:'fist2'}}},
 shakefists:{n:'挥拳',d:[16,24],f:t=>({L:t%4<2?'fist':'fist2',R:t%4<2?'fist2':'fist',dx:t%2?1:-1})},
 point:{n:'指着K线',d:[18,26],face:1,f:t=>({R:t%6<3?'point':'point2',tilt:1,dx:t%6<3?1:0})},
 lean:{n:'凑近看盘',d:[24,36],f:(t)=>({tilt:1,R:'chin',dyBody:t%14<7?0:1})},
 startle:{n:'吓一跳',d:[12,13],f:t=>({L:'startle',R:'startle',dyAll:t<3?-3:0})},
 collapse:{n:'瘫坐',d:[40,60],f:t=>({sit:Math.min(4,t),L:'limp',R:'limp',tilt:t%20<10?-1:0,dyHead:t>4?1:0})},
 limpsway:{n:'摇摇晃晃',d:[24,32],f:t=>({L:'limp',R:'limp',tilt:t%16<8?-1:1,dyBody:1,dx:t%16<8?0:1})},
 sitnod:{n:'坐着打瞌睡',d:[40,60],f:t=>({sit:4,L:'clasp',R:'clasp',dyHead:t%12<6?0:1,tilt:-1})},
 foottap:{n:'抖腿',d:[20,28],f:t=>({lift:[0,t%4<2?1:0],dyBody:0})},
 hairflip:{n:'撩头发',d:[14,18],f:t=>({R:t<10?'hair':'down',tilt:t<10?-1:0})},
 shrug:{n:'摊手',d:[16,20],f:t=>({R:'shrug',tilt:1,dyBody:t>2&&t<10?-1:0})},
 facepalm:{n:'扶额',d:[20,28],f:()=>({R:'face',tilt:1,dyHead:1})},
 sigh:{n:'叹气',d:[18,24],f:t=>({dyBody:t>4&&t<14?1:0,dyHead:t>4&&t<14?1:0,tilt:-1})},
 lookaway:{n:'别过头去',d:[20,28],flip:1,f:t=>({tilt:-1,R:t<12?'hair':'down'})},
 spin:{n:'转圈',d:[12,12],f:t=>({flip:t%4<2,dyAll:t%4<2?-1:0,L:'up',R:'up'})},
 bounce:{n:'原地蹦',d:[16,24],f:t=>({dyAll:t%4<2?0:-1})},
 // transitions
 notice:{n:'↳ 愣住，盯着K线',d:[6,6],tr:1,keepSit:1,f:()=>({tilt:1,L:'keep',R:'keep'})},
 tocheek:{n:'↳ 手捂上脸',d:[4,4],tr:1,keepSit:1,f:()=>({L:'cheek',R:'cheek'})},
 escalate:{n:'↳ 越想越慌',d:[6,6],tr:1,f:t=>({dx:t%2?1:-1,L:'keep',R:'keep'})},
 buckle:{n:'↳ 腿一软坐下',d:[10,10],tr:1,f:t=>({sit:Math.min(4,t>>1),L:'limp',R:'limp',dyHead:t>6?1:0})},
 standup:{n:'↳ 爬起来',d:[10,10],tr:1,f:t=>({sit:Math.max(0,4-(t>>1)),L:'down',R:'down',tilt:t<6?-1:0})},
 yawn:{n:'↳ 打哈欠',d:[8,8],tr:1,f:t=>({R:'face',tilt:-1,sit:t>4?Math.min(4,t-4):0})},
 wake:{n:'↳ 伸懒腰起身',d:[12,12],tr:1,f:t=>({L:'up2',R:'up2',sit:t<6?4:Math.max(0,4-(t-6)),tilt:t<6?-1:0})},
 relief:{n:'↳ 松一口气',d:[10,10],tr:1,f:t=>({dyBody:t<6?1:0,dyHead:t<6?1:0,L:'down',R:'down',tilt:-1})},
 hopin:{n:'↳ 一下跳起来',d:[8,8],tr:1,f:t=>({dyAll:[0,-2,-4,-5,-4,-2,0,0][t],L:'up',R:'up'})},
 // seated loops
 sitidle:{n:'无聊，坐下晃腿',d:[40,56],f:(t,a,D)=>{const s=t<8?t>>1:t>D-8?Math.max(0,(D-t)>>1):4;return{sit:s,dyHead:t%12<6?0:1,tilt:t%24<12?-1:0}}},
 sitcry:{n:'坐在地上哭',d:[30,40],seated:1,f:t=>({sit:4,L:'eyes',R:'eyes',dyHead:t%6<3?0:1,dx:t%6===0?1:0})},
 sitlimp:{n:'瘫坐发呆',d:[30,40],seated:1,f:t=>({sit:4,L:'limp',R:'limp',tilt:t%20<10?-1:0,dyHead:1})},
 sitpound:{n:'坐着捶地',d:[20,28],seated:1,f:t=>({sit:4,L:t%4<2?'fist':'limp',R:t%4<2?'limp':'fist',dyAll:t%4===1?1:0})}
};
ACTS.sitnod.seated=1;
// per-character repertoire: [act, weight, params]
const REP={
 kurumi:{calm:[['breathe',3],['look',2],['walk',1],['sitidle',1]],focus:[['lean',3,{arms:'pray'}],['look',1]],happy:[['banzai',2],['hop',2],['spin',1]],smug:[['breathe',2,{tilt:1}],['wave',1]],
  loss:[['cheeks',3,{orig:1}],['look',1,{orig:1}]],shock:[['startle',1,{orig:1}]],scream:[['cheeks',3,{shake:1,orig:1}],['run',1,{orig:1}]],despair:[['sitcry',2,{orig:1}],['sitlimp',2]],sleep:[['sitnod',1,{orig:1}]]},
 mebuki:{calm:[['breathe',2],['bounce',1],['walk',2],['sitidle',1]],focus:[['point',2],['lean',1]],happy:[['fistpump',3],['banzai',1],['spin',1],['hop',1]],smug:[['breathe',2,{tilt:1}],['wave',1],['bounce',1]],
  loss:[['headhold',2],['pace',2]],shock:[['startle',1]],scream:[['headhold',3,{shake:1}],['run',1,{arms:'head'}]],despair:[['sitlimp',2],['sitcry',1]],sleep:[['sitnod',1]]},
 yasuko:{calm:[['breathe',2],['look',2],['stomp',1]],focus:[['point',3],['lean',1]],happy:[['banzai',2],['fistpump',2],['hop',1]],smug:[['fistpump',1],['breathe',2,{tilt:1}]],
  loss:[['shakefists',3],['stomp',2]],shock:[['startle',1]],scream:[['point',2],['shakefists',2],['stomp',2]],despair:[['sitpound',2],['sitlimp',1]],sleep:[['sitnod',1]]},
 mochiko:{calm:[['breathe',2],['foottap',2],['hairflip',1],['look',1]],focus:[['lean',2],['breathe',1]],happy:[['hairflip',2],['lookaway',2]],smug:[['shrug',2],['hairflip',2]],
  loss:[['facepalm',2],['foottap',2],['sigh',1]],shock:[['startle',1]],scream:[['point',2],['stomp',1]],despair:[['sigh',2],['lookaway',2]],sleep:[['sitnod',1]]}
};

function armTarget(p,name){const n=name||RIG[p.id].def;return n==='orig'?null:(AP[n]||AP.down)}

// ---------- composition ----------
const LW = 48, LH = 52, PW = 96, PH = 52;
function compose(g,p,mood,t,pose,armState,o){
  o.orig=pose.L==='orig'&&pose.R==='orig'||(!pose.Lv&&!pose.Rv&&!armTarget(p,pose.L)&&!armTarget(p,pose.R));
  const r=RIG[p.id],src=prepared(p,mood,o),w=src.width,h=src.height;
  g.clearRect(0,0,LW,LH);
  const sit=pose.sit||0,dyAll=(pose.dyAll||0)+sit,dyB=(pose.dyBody||0)+dyAll,dyH=(pose.dyHead??0)+(pose.dyBody||0)+dyAll,dx=pose.dx||0;
  const ox=Math.floor((LW-w)/2)+dx,oy=LH-1-h;
  const lift=pose.lift||[0,0];
  if(sit<3){
    const hop=Math.min(0,pose.dyAll||0);
    g.drawImage(src,0,r.legY,r.legX,h-r.legY,ox,oy+r.legY-lift[0]+hop,r.legX,h-r.legY);
    g.drawImage(src,r.legX,r.legY,w-r.legX,h-r.legY,ox+r.legX,oy+r.legY-lift[1]+hop,w-r.legX,h-r.legY);
  }
  g.drawImage(src,0,r.split,w,r.legY-r.split,ox,oy+r.split+dyB,w,r.legY-r.split);
  const tilt=pose.tilt||0;
  for(let y=0;y<r.split;y++){const s=Math.round(tilt*(r.split-y)/r.split);g.drawImage(src,0,y,w,1,ox+s,oy+y+dyH,w,1)}
  const arms=[];
  r.sh.forEach((s,i)=>{if(!s)return;const m=i===0?1:-1;arms.push([ox+s[0],oy+s[1]+dyB,armState[i],m])});
  if(!o.orig)drawArms(g,arms,r.col);
  return{ox,top:oy+dyH,w,h};
}
function fx(g,mood,t,b,p){
  const P=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)};const{ox,top,w}=b,cx=ox+Math.floor(w/2);
  if(mood==='happy'){[[ox-3,top+5],[ox+w+2,top+9],[ox+w,top-1],[ox-1,top+16]].forEach(([x,y],i)=>{if((i+t)%3===0)return;const c=(i+t)%2?'#ffd84a':'#fff3b0';P(x,y,c);P(x-1,y,c);P(x+1,y,c);P(x,y-1,c);P(x,y+1,c)})}
  if(mood==='smug'&&t%12<4){const x=ox+p.ox+(p.tpl===10?8:9),y=top+p.oy;P(x,y,'#fff');P(x-1,y,'#fff');P(x+1,y,'#fff');P(x,y-1,'#fff');P(x,y+1,'#fff')}
  if(mood==='loss'){[[ox+w-4,6,0],[ox+2,9,4]].forEach(([x,base,off])=>{const k=(t+off)%10;if(k>7)return;const y=top+base+k;P(x,y,'#7cc8ff');P(x,y+1,'#7cc8ff');P(x-1,y+1,'#7cc8ff');P(x+1,y+1,'#7cc8ff');P(x,y+2,'#7cc8ff')})}
  if(mood==='shock'){for(let k=0;k<4;k++)P(cx,top-6+k,'#ff5555');P(cx,top-1,'#ff5555');for(let i=4;i<w-4;i+=2)for(let k=0;k<3;k++)P(ox+i,top+5+k,'rgba(74,120,200,.7)')}
  if(mood==='scream'){const x=ox+w+1,y=top+2;for(let k=0;k<4;k++){P(x,y+k,'#ff5555');P(x+2,y+k,'#ff5555')}P(x,y+5,'#ff5555');P(x+2,y+5,'#ff5555')}
  if(mood==='despair'){for(let i=2;i<w-2;i+=3)for(let k=0;k<4;k++)P(ox+i,top+2+k,'rgba(74,120,200,.9)');
    if(!reduce){const k=t%24,sy=top-2-Math.floor(k/2),sx=cx+(k%8<4?0:1),al=1-k/24,s=`rgba(235,240,255,${al.toFixed(2)})`;
      [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[2,2],[1,3]].forEach(([a,c])=>P(sx-1+a,sy+c,s));P(sx-1,sy+1,'rgba(30,30,40,'+al+')');P(sx+1,sy+1,'rgba(30,30,40,'+al+')')}}
}
function zzz(g,x,top,t){const P=(x,y)=>{g.fillStyle='#cfe2ff';g.fillRect(x,y,1,1)};
  [0,6].forEach(d=>{const kk=(t+d)%18;if(kk>14)return;const zx=x+Math.floor(kk/3),zy=top+2-Math.floor(kk/2);['###','.#.','###'].forEach((r,ri)=>[...r].forEach((ch,ci)=>{if(ch==='#')P(zx+ci,zy+ri)}))})}

// ---------- behaviour engine ----------
function pickAct(id,mood,prev){const list=REP[id][mood];let tot=0;list.forEach(e=>tot+=e[1]*(e[0]===prev&&list.length>1?.25:1));
  let r=Math.random()*tot;for(const e of list){r-=e[1]*(e[0]===prev&&list.length>1?.25:1);if(r<=0)return e}return list[0]}
const CALMISH=['calm','focus','smug','happy'],PANIC=['loss','scream','shock'];
const seatedMood=(id,m)=>REP[id][m].every(e=>ACTS[e[0]].seated);
const origMood=(id,m)=>REP[id][m].every(e=>e[2]&&e[2].orig);
// transition rules: from -> to => clips played before the target state's loop
function transitions(id,from,to,seated,orig){
  if(from==null)return[];const q=[];
  if(seated&&!seatedMood(id,to))q.push(from==='sleep'?'wake':'standup');
  if(to==='happy'&&!PANIC.includes(from))q.push('hopin');
  else if(to==='loss'&&CALMISH.includes(from))q.push('notice');
  else if(to==='scream'&&from==='loss')q.push('escalate');
  else if(CALMISH.includes(to)&&PANIC.includes(from))q.push('relief');
  if(to==='sleep')q.push('yawn');
  else if(seatedMood(id,to)&&!seated)q.push('buckle');
  if(origMood(id,to)&&!orig&&to!=='shock')q.push('tocheek');
  return q;
}
const TRDOC=[['任意 → 狂喜','一下跳起来'],['平静/盯盘/得意/狂喜 → 冒汗','愣住，盯着K线'],['冒汗 → 绝叫','越想越慌'],['冒汗/绝叫/惊呆 → 平静类','松一口气'],['站着 → 爆仓（坐地类）','腿一软坐下'],['坐着 → 站着的状态','爬起来（从打盹醒来是伸懒腰）'],['任意 → 打盹','打哈欠，坐下'],['画的手 → 原图捂脸手（くるみ）','手先捂上脸，再切回原图'],['任意 → 惊呆','直接打断，吓一跳']];

// ---------- public API ----------
export { PETS, MOODS, L as LINES, T10, T11, SHAPE, RIG, AP as ARM_POSES, ACTS, REP as REPERTOIRE, TRDOC as TRANSITIONS };
export const SIZE = { width: PW, height: PH };

/** 盈亏（%）→ 状态。agent：Agent 盯盘中；closed：休市。惊呆用 pet.shock() 触发。 */
export function moodFromPnl(pnl, { agent = false, closed = false } = {}) {
  if (closed) return 'sleep';
  if (pnl >= 4) return 'happy';
  if (pnl >= 2) return 'smug';
  if (pnl > -1) return agent ? 'focus' : 'calm';
  if (pnl > -3) return 'loss';
  if (pnl > -6) return 'scream';
  return 'despair';
}

let loading;
/** 预加载四张精灵（mountPet 会自动调用）。 */
export function loadSprites() {
  if (!loading) loading = Promise.all(PETS.map((p) => new Promise((ok, bad) => {
    const im = new Image(); im.onload = () => { BASE[p.id] = im; ok(); }; im.onerror = bad; im.src = SPR[p.id];
  })));
  return loading;
}

/** 静态单帧：某个角色某个状态的代表姿势，画到 48×52 的画布上（做图标、精灵表用）。 */
export async function still(canvas, petId, mood) {
  await loadSprites();
  const p = PETS.find((x) => x.id === petId); canvas.width = LW; canvas.height = LH;
  const e = REP[p.id][mood][0], pose = ACTS[e[0]].f(12, e[2] || {}, 40);
  if (e[2] && e[2].orig) pose.L = pose.R = 'orig'; else if (e[2] && e[2].arms) pose.L = pose.R = e[2].arms;
  const tgt = (n) => { const k = n || RIG[p.id].def; return k === 'orig' ? AP.limp : (AP[k] || AP.down); };
  const g = canvas.getContext('2d'); const b = compose(g, p, mood, 3, pose, [tgt(pose.L), tgt(pose.R)], { look: 1, age: 9 }); fx(g, mood, 3, b, p);
}

export function mountPet(canvas, { pet = 'kurumi', mood: startMood = 'calm', onState } = {}) {
  canvas.width = PW; canvas.height = PH; canvas.style.imageRendering = 'pixelated';
  const pg = canvas.getContext('2d');
  const lc = document.createElement('canvas'); lc.width = LW; lc.height = LH; const lg = lc.getContext('2d');
  const B={x:PW/2,face:1,act:null,par:{},t:0,dur:0,mood:null,target:PW/2,arms:[[0,0,0,0],[0,0,0,0]],queue:[],seated:false,orig:false};
function startAct(e){B.act=e[0];B.par=e[2]||{};B.t=0;const d=ACTS[B.act].d;B.dur=d[0]+Math.floor(Math.random()*(d[1]-d[0]+1));
  if(ACTS[B.act].walk){let tx;do{tx=24+Math.random()*(PW-48)}while(Math.abs(tx-B.x)<14);B.target=tx}
  if(ACTS[B.act].flip)B.face=-B.face;if(ACTS[B.act].face)B.face=1}
function stepBehaviour(p,mood){
  if(B.mood!==mood){B.queue=(mood==='shock'?[]:transitions(p.id,B.mood,mood,B.seated,B.orig)).map(n=>[n,1,{}]);if(mood==='shock'&&B.seated)B.queue=[['standup',1,{}]];B.mood=mood;B.act=null}
  if(!B.act||B.t>=B.dur){startAct(B.queue.length?B.queue.shift():pickAct(p.id,mood,B.act))}
  const A=ACTS[B.act],pose=reduce?{}:A.f(B.t,B.par,B.dur);
  if(A.keepSit&&B.seated)pose.sit=4;
  if(B.par.orig){pose.L=pose.R='orig'}else if(B.par.arms){pose.L=pose.R=B.par.arms}
  if(A.walk&&!reduce){const dir=Math.sign(B.target-B.x);if(Math.abs(B.target-B.x)>1){B.x+=dir*A.walk;B.face=dir}else{pose.lift=[0,0];pose.dyBody=0;pose.L=pose.R=undefined}}
  const tgt=[pose.L==='keep'?(B.orig?null:B.arms[0]):armTarget(p,pose.L),pose.R==='keep'?(B.orig?null:B.arms[1]):armTarget(p,pose.R)];
  if(pose.L==='keep'&&B.orig)pose.L='orig';if(pose.R==='keep'&&B.orig)pose.R='orig';
  if(pose.L==='keep')pose.L=undefined,pose.Lv=tgt[0];if(pose.R==='keep')pose.R=undefined,pose.Rv=tgt[1];
  B.orig=!tgt[0]&&!tgt[1];
  B.arms=B.arms.map((v,i)=>tgt[i]?v.map((c,j)=>{const d=tgt[i][j]-c;return reduce?tgt[i][j]:c+Math.sign(d)*Math.min(2,Math.abs(d))}):AP.cheek.slice());
  B.seated=(pose.sit||0)>=3;B.t++;return pose;
}
  let cur = PETS.find((p) => p.id === pet) || PETS[0], mood = startMood, tick = 0, talking = false, shockAt = -99, look = 1, timer, last = '';
  const current = () => (tick - shockAt < 13 ? 'shock' : mood);
  function emit(m) {
    const [verb, line] = L[cur.id][m];
    onState && onState({ pet: cur.id, name: cur.name, mood: m, verb, line, banner: cur.name + ' が ' + verb + '！！！',
      act: ACTS[B.act].n, next: B.queue.map((q) => ACTS[q[0]].n.replace('↳ ', '')) });
  }
  function frame() {
    tick++; const m = current();
    if (m === 'focus' && tick % 9 === 0) look = (look + 1 + (Math.random() < 0.5 ? 1 : 0)) % 3;
    const pose = stepBehaviour(cur, m);
    const blink = !reduce && (tick % 26 === 0 || tick % 26 === 1);
    const b = compose(lg, cur, m, tick, pose, B.arms, { blink, look, talk: talking && tick % 2 === 0, age: tick - shockAt });
    fx(lg, m, tick, b, cur);
    pg.clearRect(0, 0, PW, PH); const x = Math.round(B.x - LW / 2), y = PH - LH, flip = (B.face < 0) !== !!pose.flip;
    if (flip) { pg.save(); pg.translate(x + LW, y); pg.scale(-1, 1); pg.drawImage(lc, 0, 0); pg.restore(); } else pg.drawImage(lc, x, y);
    if (m === 'sleep') zzz(pg, x + (flip ? LW - b.ox - b.w : b.ox) + b.w - 2, y + b.top, tick);
    const key = cur.id + m + B.act + B.queue.length; if (key !== last) { last = key; emit(m); }
  }
  loadSprites().then(() => { if (timer !== null) timer = setInterval(frame, reduce ? 1000 : 150); });
  return {
    setMood(m) { if (!REP[cur.id][m]) throw new Error('没有这个状态：' + m); mood = m; },
    setPet(id) { const p = PETS.find((x) => x.id === id); if (!p) throw new Error('没有这个角色：' + id); cur = p; B.act = null; B.mood = null; last = ''; },
    shock() { shockAt = tick; },
    setTalking(v) { talking = !!v; },
    get state() { return { pet: cur.id, mood: current(), act: B.act, seated: B.seated }; },
    destroy() { clearInterval(timer); timer = null; },
  };
}
