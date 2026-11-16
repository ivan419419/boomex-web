const sprite=new Image();let spriteReady=false;
sprite.src='assets/images/boomex-dog-sprite.png';
sprite.onload=()=>{spriteReady=true;};

export const player={x:48,y:48,speed:3.2,lives:3,isDead:false,direction:0,isMoving:false,startX:0,startY:0};
let gameMap,tileSize=32,columns=13,rows=13,invulnerable=0,touchId=null,touchDirection=0,buttonDirection=0,animationClock=0,facingDirection=4;
const held=[];
function blocked(x,y){const tx=Math.floor(x/tileSize),ty=Math.floor(y/tileSize);return tx<0||tx>=columns||ty<0||ty>=rows||gameMap?.[ty]?.[tx]!==0;}
function canMove(x,y){const r=9;return !blocked(x-r,y-r)&&!blocked(x+r,y-r)&&!blocked(x-r,y+r)&&!blocked(x+r,y+r);}
function move(dt){const amount=player.speed*Math.min(dt,50)/16.667;let nx=player.x,ny=player.y;if(player.direction===1)nx+=amount;if(player.direction===2)nx-=amount;if(player.direction===3)ny-=amount;if(player.direction===4)ny+=amount;if(canMove(nx,player.y))player.x=nx;if(canMove(player.x,ny))player.y=ny;}
function refreshDirection(){player.direction=buttonDirection||touchDirection||held.at(-1)||0;player.isMoving=player.direction!==0;if(player.isMoving)facingDirection=player.direction;}
function touchStart(e){if(player.isDead||touchId!==null)return;const t=e.changedTouches[0];touchId=t.identifier;player.startX=t.clientX;player.startY=t.clientY;touchDirection=0;refreshDirection();e.preventDefault();}
function touchMove(e){if(touchId===null||player.isDead)return;const t=Array.from(e.changedTouches).find(t=>t.identifier===touchId);if(!t)return;const dx=t.clientX-player.startX,dy=t.clientY-player.startY;touchDirection=Math.max(Math.abs(dx),Math.abs(dy))>10?(Math.abs(dx)>Math.abs(dy)?(dx>0?1:2):(dy>0?4:3)):0;refreshDirection();e.preventDefault();}
function touchEnd(e){if(!Array.from(e.changedTouches).some(t=>t.identifier===touchId))return;touchId=null;touchDirection=0;refreshDirection();}
const directions={arrowright:1,d:1,arrowleft:2,a:2,arrowup:3,w:3,arrowdown:4,s:4};
function keydown(e){const dir=directions[e.key.toLowerCase()];if(!dir||player.isDead)return;e.preventDefault();if(!held.includes(dir))held.push(dir);refreshDirection();}
function keyup(e){const dir=directions[e.key.toLowerCase()];if(!dir)return;const i=held.indexOf(dir);if(i>=0)held.splice(i,1);refreshDirection();}
function clearInput(){held.length=0;touchId=null;touchDirection=0;buttonDirection=0;refreshDirection();}
export function setButtonDirection(direction){buttonDirection=direction;refreshDirection();}
function drawDog(ctx,dt){const angle={1:3,2:1,3:2,4:0};const row=angle[facingDirection]??0;animationClock+=dt;const frame=player.isMoving?Math.floor(animationClock/120)%4:0;const sx=frame*64,sy=row*64;
 if(spriteReady){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,sx,sy,64,64,player.x-16,player.y-16,32,32);ctx.restore();}else{ctx.save();ctx.fillStyle='#fff1d8';ctx.strokeStyle='#183447';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(player.x,player.y,11,9,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#70462f';ctx.beginPath();ctx.ellipse(player.x-6,player.y-8,4,6,-.5,0,Math.PI*2);ctx.ellipse(player.x+6,player.y-8,4,6,.5,0,Math.PI*2);ctx.fill();ctx.restore();}
}
export function updatePlayer(dt=16.667){const ctx=document.getElementById('gameCanvas').getContext('2d');invulnerable=Math.max(0,invulnerable-dt);if(player.isDead)return;if(player.isMoving)move(dt);if(invulnerable>0&&Math.floor(invulnerable/100)%2===0)return;drawDog(ctx,dt);}
export function takeDamage(){if(player.isDead||invulnerable>0)return;player.lives--;invulnerable=1500;if(player.lives<=0){player.isDead=true;clearInput();}else{player.x=48;player.y=48;clearInput();}}
export function resetPlayer(resetLives=true){player.x=48;player.y=48;if(resetLives)player.lives=3;player.isDead=false;invulnerable=0;animationClock=0;facingDirection=4;clearInput();}
export function initPlayer(map,size=32,mapColumns=13,mapRows=13){gameMap=map;tileSize=size;columns=mapColumns;rows=mapRows;const c=document.getElementById('gameCanvas');c.addEventListener('touchstart',touchStart,{passive:false});c.addEventListener('touchmove',touchMove,{passive:false});c.addEventListener('touchend',touchEnd);c.addEventListener('touchcancel',touchEnd);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInput();});}
