import {buildSpiralRoute} from './maze.js';
import {player,takeDamage} from './player.js';

const TILE=32;
let pits=[],route=[],fireClock=0,fireIndex=0,fireHurtClock=0,fireDelay=0;
const PIT_WARNING=1700,PIT_OPEN=2400,PIT_COOLDOWN=3400,FIRE_STEP=620,FIRE_WARNING=900,FIRE_DAMAGE_COOLDOWN=1300;
const key=(x,y)=>`${x},${y}`;
function cellCenter(p){return{x:p.x*TILE+TILE/2,y:p.y*TILE+TILE/2};}
function freeCandidates(map){const cells=[];for(let y=1;y<map.length-1;y++)for(let x=1;x<map[y].length-1;x++)if(map[y][x]===0&&!(x===1&&y===1))cells.push({x,y});return cells;}
function safeDistance(p){return Math.abs(Math.floor(player.x/TILE)-p.x)+Math.abs(Math.floor(player.y/TILE)-p.y)>2;}
export function resetHazards(map,start){pits=[];route=buildSpiralRoute(map,start);fireIndex=0;fireClock=0;fireHurtClock=0;fireDelay=7000;}
export function updateHazards(dt,map){
  const step=Math.min(dt,50);fireDelay=Math.max(0,fireDelay-step);if(!fireDelay)fireClock+=step;fireHurtClock=Math.max(0,fireHurtClock-step);
  if(fireClock>=FIRE_STEP){fireClock-=FIRE_STEP;fireIndex=(fireIndex+1)%route.length;}
  for(const pit of pits){pit.clock+=step;if(pit.phase==='warning'&&pit.clock>=PIT_WARNING){pit.phase='open';pit.clock=0;}else if(pit.phase==='open'&&pit.clock>=PIT_OPEN){pit.phase='cooldown';pit.clock=0;}else if(pit.phase==='cooldown'&&pit.clock>=PIT_COOLDOWN){pit.phase='done';}}
  pits=pits.filter(p=>p.phase!=='done');
  if(pits.filter(p=>p.phase!=='done').length<3&&Math.random()<step/1800){const options=freeCandidates(map).filter(p=>safeDistance(p)&&!pits.some(h=>h.x===p.x&&h.y===p.y)&&(!route[fireIndex]||Math.abs(route[fireIndex].x-p.x)+Math.abs(route[fireIndex].y-p.y)>2));if(options.length){const p=options[Math.floor(Math.random()*options.length)];pits.push({...p,phase:'warning',clock:0});}}
  const px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);
  const pit=pits.find(p=>p.phase==='open'&&p.x===px&&p.y===py);
  const fire=fireDelay?null:route[fireIndex];if((pit||fire&&(fire.x===px&&fire.y===py))&&fireHurtClock<=0){takeDamage();fireHurtClock=FIRE_DAMAGE_COOLDOWN;}
}
export function drawHazards(ctx){
  for(const p of pits){const x=p.x*TILE,y=p.y*TILE;ctx.save();if(p.phase==='warning'){const pulse=.45+.35*Math.sin(Date.now()/90);ctx.fillStyle=`rgba(255,77,80,${pulse})`;ctx.strokeStyle='#ffbd4a';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.strokeRect(x+4,y+4,TILE-8,TILE-8);ctx.fillRect(x+8,y+8,TILE-16,TILE-16);ctx.setLineDash([]);ctx.fillStyle='#fff';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('!',x+TILE/2,y+TILE/2+4);}else if(p.phase==='open'){ctx.fillStyle='#020408';ctx.beginPath();ctx.ellipse(x+TILE/2,y+TILE/2,13,10,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff5748';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#ff7a46';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('↓',x+TILE/2,y+TILE/2+4);}else{ctx.fillStyle='rgba(35,67,69,.8)';ctx.beginPath();ctx.ellipse(x+TILE/2,y+TILE/2,11,7,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
  if(!route.length)return;const upcoming=route[(fireIndex+Math.max(1,Math.ceil(FIRE_WARNING/FIRE_STEP)))%route.length];const current=route[fireIndex];
  const marker=(p,color,alpha,size)=>{const c=cellCenter(p);ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(c.x,c.y,size,0,Math.PI*2);ctx.fill();ctx.restore();};
  for(let i=1;i<=4;i++){const trace=route[(fireIndex+i)%route.length],tc=cellCenter(trace);ctx.save();ctx.globalAlpha=.22/(i*.6);ctx.strokeStyle='#ff8a35';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.strokeRect(tc.x-11,tc.y-11,22,22);ctx.restore();}
  marker(upcoming,'#ff5a31',.38,10);
  const c=cellCenter(current);if(fireDelay){marker(current,'#ff5a31',.25+.2*Math.sin(Date.now()/120),12);return;}ctx.save();ctx.fillStyle='#ff371f';ctx.shadowColor='#ff6a22';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(c.x,c.y,12+Math.sin(Date.now()/55)*2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe15a';ctx.beginPath();ctx.arc(c.x,c.y,6,0,Math.PI*2);ctx.fill();ctx.restore();
}
