const bombermanImage = new Image();
bombermanImage.src = 'assets/images/bomberman_walk.png';

export const player = {
  x: 1 * 32 + 16, y: 1 * 32 + 16, speed: 3.2, lives: 3,
  isDead: false, direction: 0, isMoving: false, startX: 0, startY: 0
};

let gameMap, tileSize = 32, columns = 13, rows = 13;

function isBlocked(x, y) {
  const tx = Math.floor(x / tileSize), ty = Math.floor(y / tileSize);
  return tx < 0 || tx >= columns || ty < 0 || ty >= rows || gameMap?.[ty]?.[tx] !== 0;
}

function canMoveTo(x, y) {
  const r = 10;
  return !isBlocked(x-r,y-r) && !isBlocked(x+r,y-r) && !isBlocked(x-r,y+r) && !isBlocked(x+r,y+r);
}

function updatePosition() {
  let nx = player.x, ny = player.y;
  if (player.direction === 1) nx += player.speed;
  if (player.direction === 2) nx -= player.speed;
  if (player.direction === 3) ny -= player.speed;
  if (player.direction === 4) ny += player.speed;
  if (canMoveTo(nx, player.y)) player.x = nx;
  if (canMoveTo(player.x, ny)) player.y = ny;
}

function handleTouchStart(e) {
  e.preventDefault(); if (player.isDead) return;
  const t = e.touches[0]; player.startX = t.clientX; player.startY = t.clientY; player.isMoving = true;
}
function handleTouchMove(e) {
  if (!player.isMoving || player.isDead) return; e.preventDefault();
  const t = e.touches[0], dx = t.clientX-player.startX, dy = t.clientY-player.startY;
  if (Math.abs(dx)>10 || Math.abs(dy)>10) {
    player.direction = Math.abs(dx)>Math.abs(dy) ? (dx>0?1:2) : (dy>0?4:3); updatePosition();
  }
}
function handleTouchEnd() { player.isMoving = false; player.direction = 0; }
function handleKeyboard(e) {
  if (player.isDead) return; const k=e.key.toLowerCase();
  if (k==='arrowright'||k==='d') player.direction=1;
  else if(k==='arrowleft'||k==='a') player.direction=2;
  else if(k==='arrowup'||k==='w') player.direction=3;
  else if(k==='arrowdown'||k==='s') player.direction=4;
  else return; player.isMoving=true; e.preventDefault();
}
function stopKeyboard(e) {
  if(['arrowright','arrowleft','arrowup','arrowdown','w','a','s','d'].includes(e.key.toLowerCase())) { player.isMoving=false; player.direction=0; }
}

export function updatePlayer() {
  const ctx = document.getElementById('gameCanvas').getContext('2d');
  if (player.isDead) return; if (player.isMoving) updatePosition();
  if (bombermanImage.complete && bombermanImage.naturalWidth > 0) ctx.drawImage(bombermanImage, player.x-16, player.y-16, 32, 32);
  else { ctx.fillStyle='#25e6ff'; ctx.shadowColor='#25e6ff'; ctx.shadowBlur=10; ctx.fillRect(player.x-11,player.y-11,22,22); ctx.shadowBlur=0; }
}

export function takeDamage() {
  if (player.isDead) return; player.lives--;
  if (player.lives <= 0) player.isDead=true;
  else { player.x=1*tileSize+16; player.y=1*tileSize+16; }
}

export function initPlayer(map, size=32, mapColumns=13, mapRows=13) {
  gameMap=map; tileSize=size; columns=mapColumns; rows=mapRows;
  const canvas=document.getElementById('gameCanvas');
  canvas.addEventListener('touchstart',handleTouchStart,{passive:false});
  canvas.addEventListener('touchmove',handleTouchMove,{passive:false});
  canvas.addEventListener('touchend',handleTouchEnd);
  window.addEventListener('keydown',handleKeyboard); window.addEventListener('keyup',stopKeyboard);
}
