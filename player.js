const bombermanImage = new Image();
let bombermanSprite = null;
bombermanImage.src = 'assets/images/bomberman_walk.png';
bombermanImage.onload = () => {
  const c = document.createElement('canvas'); c.width = bombermanImage.width; c.height = bombermanImage.height;
  const x = c.getContext('2d'); x.drawImage(bombermanImage, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height);
  for (let i=0; i<d.data.length; i+=4) if (d.data[i]>205 && d.data[i+1]>205 && d.data[i+2]>205) d.data[i+3]=0;
  x.putImageData(d,0,0); bombermanSprite=c;
};

export const player={x:48,y:48,speed:3.2,lives:3,isDead:false,direction:0,isMoving:false,startX:0,startY:0};
let gameMap,tileSize=32,columns=13,rows=13,invulnerable=0,touchId=null,touchDirection=0, buttonDirection=0;
const held=[];
function blocked(x,y){const tx=Math.floor(x/tileSize),ty=Math.floor(y/tileSize);return tx<0||tx>=columns||ty<0||ty>=rows||gameMap?.[ty]?.[tx]!==0;}
function canMove(x,y){const r=10;return !blocked(x-r,y-r)&&!blocked(x+r,y-r)&&!blocked(x-r,y+r)&&!blocked(x+r,y+r);}
function move(dt){const amount=player.speed*Math.min(dt,50)/16.667;let nx=player.x,ny=player.y;if(player.direction===1)nx+=amount;if(player.direction===2)nx-=amount;if(player.direction===3)ny-=amount;if(player.direction===4)ny+=amount;if(canMove(nx,player.y))player.x=nx;if(canMove(player.x,ny))player.y=ny;}
function refreshDirection(){player.direction=buttonDirection||touchDirection||held.at(-1)||0;player.isMoving=player.direction!==0;}
function touchStart(e){if(player.isDead||touchId!==null)return;const t=e.changedTouches[0];touchId=t.identifier;player.startX=t.clientX;player.startY=t.clientY;touchDirection=0;refreshDirection();e.preventDefault();}
function touchMove(e){if(touchId===null||player.isDead)return;const t=Array.from(e.changedTouches).find(t=>t.identifier===touchId);if(!t)return;const dx=t.clientX-player.startX,dy=t.clientY-player.startY;touchDirection=Math.max(Math.abs(dx),Math.abs(dy))>10?(Math.abs(dx)>Math.abs(dy)?(dx>0?1:2):(dy>0?4:3)):0;refreshDirection();e.preventDefault();}
function touchEnd(e){if(!Array.from(e.changedTouches).some(t=>t.identifier===touchId))return;touchId=null;touchDirection=0;refreshDirection();}
const directions={arrowright:1,d:1,arrowleft:2,a:2,arrowup:3,w:3,arrowdown:4,s:4};
function keydown(e){const dir=directions[e.key.toLowerCase()];if(!dir||player.isDead)return;e.preventDefault();if(!held.includes(dir))held.push(dir);refreshDirection();}
function keyup(e){const dir=directions[e.key.toLowerCase()];if(!dir)return;const i=held.indexOf(dir);if(i>=0)held.splice(i,1);refreshDirection();}
function clearInput(){held.length=0;touchId=null;touchDirection=0;buttonDirection=0;refreshDirection();}
export function setButtonDirection(direction){buttonDirection=direction;refreshDirection();}
export function updatePlayer(dt=16.667){const ctx=document.getElementById('gameCanvas').getContext('2d');invulnerable=Math.max(0,invulnerable-dt);if(player.isDead)return;if(player.isMoving)move(dt);if(invulnerable>0&&Math.floor(invulnerable/100)%2===0)return;if(bombermanSprite)ctx.drawImage(bombermanSprite,player.x-16,player.y-16,32,32);else if(bombermanImage.complete&&bombermanImage.naturalWidth)ctx.drawImage(bombermanImage,player.x-16,player.y-16,32,32);else{ctx.fillStyle='#25e6ff';ctx.fillRect(player.x-11,player.y-11,22,22);}}
export function takeDamage(){if(player.isDead||invulnerable>0)return;player.lives--;invulnerable=1500;if(player.lives<=0){player.isDead=true;clearInput();}else{player.x=48;player.y=48;clearInput();}}
export function resetPlayer(){player.x=48;player.y=48;player.lives=3;player.isDead=false;invulnerable=0;clearInput();}
export function initPlayer(map,size=32,mapColumns=13,mapRows=13){gameMap=map;tileSize=size;columns=mapColumns;rows=mapRows;const c=document.getElementById('gameCanvas');c.addEventListener('touchstart',touchStart,{passive:false});c.addEventListener('touchmove',touchMove,{passive:false});c.addEventListener('touchend',touchEnd);c.addEventListener('touchcancel',touchEnd);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInput();});}
