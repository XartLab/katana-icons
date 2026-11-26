// 预览页的交互（不进包）：演示行情、按钮、表格。宠物本身全走 @katana-icons/pets 的公开 API。
{
const $=(id)=>document.getElementById(id);
const reduceUI=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pnl=-4,manual=null,auto=null,agent=false,closed=false,typed='';
const pet=mountPet($('pet'),{pet:'kurumi',onState:(s)=>{
  $('banner').textContent=s.banner;$('tab').textContent=s.name;
  $('act').textContent=MOODS.find(z=>z[0]===s.mood)[1]+' · '+s.act+(s.next.length?'（接着：'+s.next.join(' → ')+'）':'');
  if(s.line!==typed){typed=s.line;const el=$('dlg');if(reduceUI){el.textContent=s.line;return}
    let i=0;pet.setTalking(true);clearInterval(type.t);type.t=setInterval(()=>{el.textContent=s.line.slice(0,++i);if(i>=s.line.length){clearInterval(type.t);pet.setTalking(false)}},55)}
}});
function type(){}
const moodNow=()=>manual||moodFromPnl(pnl,{agent,closed});
function ui(){
  pet.setMood(moodNow());
  $('pv').textContent=(pnl>0?'+':'')+pnl.toFixed(1)+'%';$('pv').style.color=pnl>=0?'#2fae6a':'#e04b4b';
  $('pm').textContent='→ '+MOODS.find(x=>x[0]===moodNow())[1]+(manual?'（手动）':'');
  document.querySelectorAll('#moods button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===manual));
  document.querySelectorAll('#pick button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===pet.state.pet));
}
// candles
let candles=[];
function seed(){let v=100;for(let i=0;i<20;i++){const d=(i<8?Math.sin(i)*1.4:-1.1)+(Math.random()-.5)*2.2;const o=v,c=v+d;candles.push({o,c,h:Math.max(o,c)+Math.random()*1.6,l:Math.min(o,c)-Math.random()*1.6});v=c}}
function pushCandle(d0){const last=candles[candles.length-1].c;const d=d0*1.6+(Math.random()-.5)*1.2;const o=last,c=last+d;candles.push({o,c,h:Math.max(o,c)+Math.random()*1.5,l:Math.min(o,c)-Math.random()*1.5});if(candles.length>20)candles.shift()}
const bg=$('bg'),bx=bg.getContext('2d');
function drawBg(){const W=bg.clientWidth,H=bg.clientHeight,dpr=devicePixelRatio||1;bg.width=W*dpr;bg.height=H*dpr;bx.setTransform(dpr,0,0,dpr,0,0);bx.clearRect(0,0,W,H);
  let hi=-1e9,lo=1e9;candles.forEach(k=>{hi=Math.max(hi,k.h);lo=Math.min(lo,k.l)});
  const top=H*.3,bot=H*1.02,y=v=>Math.round(top+(hi-v)/(hi-lo||1)*(bot-top))+.5,step=W/16,bw=Math.max(8,step*.62),lw=Math.max(2,W/360);
  bx.strokeStyle='#fff';bx.lineWidth=lw;
  candles.forEach((k,i)=>{const x=Math.round(-step*2+i*step)+.5,m=x+bw/2;bx.beginPath();bx.moveTo(m,y(k.h));bx.lineTo(m,y(Math.max(k.o,k.c)));bx.moveTo(m,y(Math.min(k.o,k.c)));bx.lineTo(m,y(k.l));bx.stroke();
    const t=y(Math.max(k.o,k.c)),b=Math.max(y(Math.min(k.o,k.c)),t+lw*2);bx.strokeRect(x,t,bw,b-t)})}
$('moods').innerHTML=MOODS.map(([k,n])=>`<button data-m="${k}" aria-pressed="false">${n}</button>`).join('');
$('pick').innerHTML=PETS.map(p=>`<button data-p="${p.id}" aria-pressed="false">${p.name}</button>`).join('');
$('moods').onclick=e=>{const b=e.target.closest('button');if(!b)return;manual=manual===b.dataset.m?null:b.dataset.m;if(manual==='shock'){pet.shock();manual=null}ui()};
const choose=id=>{pet.setPet(id);typed='';ui()};
$('pick').onclick=e=>{const b=e.target.closest('button');if(b)choose(b.dataset.p)};
$('sl').oninput=e=>{pnl=+e.target.value;manual=null;ui()};
const tog=(id,fn)=>{$(id).onclick=()=>{const v=fn();$(id).setAttribute('aria-pressed',v);manual=null;ui()}};
tog('agent',()=>agent=!agent);tog('closed',()=>closed=!closed);
$('auto').onclick=()=>{if(auto){clearInterval(auto);auto=null;$('auto').setAttribute('aria-pressed','false');return}
  $('auto').setAttribute('aria-pressed','true');manual=null;
  auto=setInterval(()=>{let d=(Math.random()-.5)*1.4;if(Math.random()<.08)d=-1.6-Math.random();pnl=Math.max(-12,Math.min(8,pnl+d));if(d<-1.5)pet.shock();$('sl').value=pnl;pushCandle(d);drawBg();ui()},900)};
// roster, sheet, tables
PETS.forEach(p=>{const b=document.createElement('button');b.className='pc';const im=document.createElement('img');im.src=SPRITES[p.id];im.alt=p.name;b.appendChild(im);
  const t=document.createElement('div');t.innerHTML=`<strong>${p.name}</strong><span>${p.role}</span><span>${p.desc}</span>`;b.appendChild(t);
  b.onclick=()=>{choose(p.id);$('stage').scrollIntoView({behavior:reduceUI?'auto':'smooth',block:'center'})};$('roster').appendChild(b)});
const tb=$('sheet');tb.innerHTML='<thead><tr><th></th>'+MOODS.map(m=>`<th scope="col">${m[1]}</th>`).join('')+'</tr></thead>';
const body=document.createElement('tbody');
PETS.forEach(p=>{const tr=document.createElement('tr');tr.innerHTML=`<th scope="row">${p.name}</th>`;
  MOODS.forEach(([k])=>{const td=document.createElement('td');const c=document.createElement('canvas');still(c,p.id,k);c.setAttribute('role','img');c.setAttribute('aria-label',p.name+' '+k);td.appendChild(c);tr.appendChild(td)});body.appendChild(tr)});
tb.appendChild(body);
$('sm').innerHTML='<thead><tr><th>状态</th>'+PETS.map(p=>`<th>${p.name}</th>`).join('')+'</tr></thead><tbody>'+
  MOODS.map(([k,n])=>`<tr><td>${n}</td>`+PETS.map(p=>`<td>${REPERTOIRE[p.id][k].map(e=>ACTS[e[0]].n+(e[2]&&e[2].shake?'（发抖）':'')+(e[2]&&e[2].orig?'（原图手）':'')+' ×'+e[1]).join('、')}</td>`).join('')+'</tr>').join('')+'</tbody>';
$('tr').innerHTML='<thead><tr><th>状态切换</th><th>先播放的过渡动作</th></tr></thead><tbody>'+TRANSITIONS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')+'</tbody>';
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({rig:RIG,repertoire:REPERTOIRE,lines:LINES}));$('cmsg').textContent='已复制。'}catch(e){$('cmsg').textContent='浏览器拒绝了剪贴板。'}};
seed();new ResizeObserver(()=>drawBg()).observe($('stage'));$('sl').value=pnl;ui();
}
