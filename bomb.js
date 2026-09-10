import { player, takeDamage } from './player.js';

const bombImg = new Image();
bombImg.src = 'assets/images/bomb.png';
let bombs=[], explosions=[];
const MAX_BOMBS=1, BOMB_TIMER=3000, EXPLOSION_DURATION=650, EXPLOSION_RANGE=2;

export function placeBomb(map, tileSize=32) {
  if(bombs.length>=MAX_BOMBS) return;
  const tileX=Math.floor(player.x/tileSize), tileY=Math.floor(player.y/tileSize);
  if(map[tileY]?.[tileX]!==0 || bombs.some(b=>b.tileX===tileX&&b.tileY===tileY)) return;
  bombs.push({tileX,tileY,x:tileX*tileSize+tileSize/2,y:tileY*tileSize+tileSize/2,timer:BOMB_TIMER,placedAt:Date.now()});
}

function createExplosion(tileX,tileY,type,enemies,tileSize) {
  explosions.push({tileX,tileY,type,x:tileX*tileSize+tileSize/2,y:tileY*tileSize+tileSize/2,spawnedAt:Date.now()});
  if(Math.floor(player.x/tileSize)===tileX&&Math.floor(player.y/tileSize)===tileY) takeDamage();
  for(let i=enemies.length-1;i>=0;i--) if(Math.floor(enemies[i].x/tileSize)===tileX&&Math.floor(enemies[i].y/tileSize)===tileY) enemies.splice(i,1);
}

function detonateBomb(bomb,map,enemies,tileSize,columns,rows) {
  createExplosion(bomb.tileX,bomb.tileY,'center',enemies,tileSize);
  const dirs=[{dx:1,dy:0,type:'horizontal'},{dx:-1,dy:0,type:'horizontal'},{dx:0,dy:-1,type:'vertical'},{dx:0,dy:1,type:'vertical'}];
  for(const d of dirs) for(let n=1;n<=EXPLOSION_RANGE;n++) {
    const x=bomb.tileX+d.dx*n,y=bomb.tileY+d.dy*n;
    if(x<0||x>=columns||y<0||y>=rows||map[y][x]===1) break;
    createExplosion(x,y,d.type,enemies,tileSize);
    if(map[y][x]===2){ map[y][x]=0; break; }
  }
}

export function updateBombs(map,enemies,tileSize=32,columns=13,rows=13) {
  const now=Date.now();
  bombs=bombs.filter(b=>{if(now-b.placedAt>=b.timer){detonateBomb(b,map,enemies,tileSize,columns,rows);return false;}return true;});
  explosions=explosions.filter(e=>now-e.spawnedAt<EXPLOSION_DURATION);
}

export function drawBombs(ctx,tileSize=32) {
  bombs.forEach(b=>{
    if(bombImg.complete&&bombImg.naturalWidth>0) ctx.drawImage(bombImg,b.x-16,b.y-16,tileSize,tileSize);
    else {ctx.fillStyle='#f5f5f5';ctx.beginPath();ctx.arc(b.x,b.y,10,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#fff';ctx.font='bold 11px monospace';ctx.textAlign='center';
    ctx.fillText(Math.max(0,Math.ceil((b.timer-(Date.now()-b.placedAt))/1000)),b.x,b.y+4);
  });
}

export function drawExplosions(ctx,tileSize=32) {
  explosions.forEach(e=>{
    const age=(Date.now()-e.spawnedAt)/EXPLOSION_DURATION, alpha=1-age;
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#ffd43b';ctx.shadowColor='#ff4eaa';ctx.shadowBlur=16;
    ctx.fillRect(e.x-tileSize*0.38,e.y-tileSize*0.38,tileSize*0.76,tileSize*0.76);
    ctx.fillStyle='#fff4a3';ctx.fillRect(e.x-tileSize*0.16,e.y-tileSize*0.16,tileSize*0.32,tileSize*0.32);ctx.restore();
  });
}
