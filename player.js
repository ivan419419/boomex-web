const bombermanImage = new Image();
let bombermanSprite = null;
bombermanImage.src = 'assets/images/bomberman_walk.png';
bombermanImage.onload = () => {
  const c = document.createElement('canvas'); c.width = bombermanImage.width; c.height = bombermanImage.height;
  const x = c.getContext('2d'); x.drawImage(bombermanImage, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height);
  for (let i=0; i<d.data.length; i+=4) {
    const r=d.data[i], g=d.data[i+1], b=d.data[i+2];
    if (r>205 && g>205 && b>205) d.data[i+3]=0;
  }
  x.putImageData(d,0,0); bombermanSprite=c;
};

export const player={x:48,y:48,speed:3.2,lives:3,isDead:false,direction:0,isMoving:false,startX:0,startY:0};
let gameMap,tileSize=32,columns=13,rows=13;
function blocked(x,y){const tx=Math.floor(x/tileSize),ty=Math.floor(y/tileSize);return tx<0||tx>=columns||ty<0||ty>=rows||gameMap?.[ty]?.[tx]!==0;}
function canMove(x,y){const r=10;return !blocked(x-r,y-r)&&!blocked(x+r,y-r)&&!blocked(x-r,y+r)&&!blocked(x+r,y+r);}
function move(){let nx=player.x,ny=player.y;if(player.direction===1)nx+=player.speed;if(player.direction===2)nx-=player.speed;if(player.direction===3)ny-=player.speed;if(player.direction===4)ny+=player.speed;if(canMove(nx,player.y))player.x=nx;if(canMove(player.x,ny))player.y=ny;}
function touchStart(e){e.preventDefault();if(player.isDead)return;const t=e.touches[0];player.startX=t.clientX;player.startY=t.clientY;player.isMoving=true;}
function touchMove(e){if(!player.isMoving||player.isDead)return;e.preventDefault();const t=e.touches[0],dx=t.clientX-player.startX,dy=t.clientY-player.startY;if(Math.abs(dx)>10||Math.abs(dy)>10){player.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?1:2):(dy>0?4:3);move();}}
function touchEnd(){player.isMoving=false;player.direction=0;}
function keydown(e){if(player.isDead)return;const k=e.key.toLowerCase();if(k==='arrowright'||k==='d')player.direction=1;else if(k==='arrowleft'||k==='a')player.direction=2;else if(k==='arrowup'||k==='w')player.direction=3;else if(k==='arrowdown'||k==='s')player.direction=4;else return;player.isMoving=true;e.preventDefault();}
function keyup(e){if(['arrowright','arrowleft','arrowup','arrowdown','w','a','s','d'].includes(e.key.toLowerCase())){player.isMoving=false;player.direction=0;}}
export function updatePlayer(){const ctx=document.getElementById('gameCanvas').getContext('2d');if(player.isDead)return;if(player.isMoving)move();if(bombermanSprite)ctx.drawImage(bombermanSprite,player.x-16,player.y-16,32,32);else if(bombermanImage.complete&&bombermanImage.naturalWidth)ctx.drawImage(bombermanImage,player.x-16,player.y-16,32,32);else{ctx.fillStyle='#25e6ff';ctx.fillRect(player.x-11,player.y-11,22,22);}}
export function takeDamage(){if(player.isDead)return;player.lives--;if(player.lives<=0)player.isDead=true;else{player.x=48;player.y=48;}}
export function initPlayer(map,size=32,mapColumns=13,mapRows=13){gameMap=map;tileSize=size;columns=mapColumns;rows=mapRows;const c=document.getElementById('gameCanvas');c.addEventListener('touchstart',touchStart,{passive:false});c.addEventListener('touchmove',touchMove,{passive:false});c.addEventListener('touchend',touchEnd);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);}
