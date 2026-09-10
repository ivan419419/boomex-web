const bombermanFrames = [new Image(), new Image(), new Image(), new Image()];

bombermanFrames[0].src = 'assets/images/sprites_cortados/bomberman_walk_0.png';
bombermanFrames[1].src = 'assets/images/sprites_cortados/bomberman_walk_1.png';
bombermanFrames[2].src = 'assets/images/sprites_cortados/bomberman_walk_2.png';
bombermanFrames[3].src = 'assets/images/sprites_cortados/bomberman_walk_3.png';

export const player = {
  x: 1 * 32 + 16,
  y: 1 * 32 + 16,
  speed: 3.2,
  lives: 3,
  isDead: false,
  direction: 0,
  frame: 0,
  isMoving: false,
  startX: 0,
  startY: 0
};

let gameMap;
let tileSize = 32;
let columns = 13;
let rows = 13;

function isBlocked(x, y) {
  const tx = Math.floor(x / tileSize);
  const ty = Math.floor(y / tileSize);
  if (tx < 0 || tx >= columns || ty < 0 || ty >= rows) return true;
  return gameMap[ty][tx] !== 0;
}

function canMoveTo(x, y) {
  const radius = 11;
  return !isBlocked(x - radius, y - radius) &&
         !isBlocked(x + radius, y - radius) &&
         !isBlocked(x - radius, y + radius) &&
         !isBlocked(x + radius, y + radius);
}

function updatePosition() {
  if (player.isDead) return;

  let nx = player.x;
  let ny = player.y;

  if (player.direction === 1) nx += player.speed;
  if (player.direction === 2) nx -= player.speed;
  if (player.direction === 3) ny -= player.speed;
  if (player.direction === 4) ny += player.speed;

  if (canMoveTo(nx, player.y)) player.x = nx;
  if (canMoveTo(player.x, ny)) player.y = ny;

  player.x = Math.max(16, Math.min(columns * tileSize - 16, player.x));
  player.y = Math.max(16, Math.min(rows * tileSize - 16, player.y));
}

function handleTouchStart(event) {
  event.preventDefault();
  if (player.isDead) return;
  const touch = event.touches[0];
  player.startX = touch.clientX;
  player.startY = touch.clientY;
  player.isMoving = true;
}

function handleTouchMove(event) {
  if (!player.isMoving || player.isDead) return;
  event.preventDefault();
  const touch = event.touches[0];
  const dx = touch.clientX - player.startX;
  const dy = touch.clientY - player.startY;

  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    player.direction = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 1 : 2)
      : (dy > 0 ? 4 : 3);
    updatePosition();
  }
}

function handleTouchEnd() {
  player.isMoving = false;
  player.direction = 0;
}

function handleKeyboard(event) {
  if (player.isDead) return;
  const key = event.key.toLowerCase();
  if (key === 'arrowright' || key === 'd') player.direction = 1;
  else if (key === 'arrowleft' || key === 'a') player.direction = 2;
  else if (key === 'arrowup' || key === 'w') player.direction = 3;
  else if (key === 'arrowdown' || key === 's') player.direction = 4;
  else return;
  player.isMoving = true;
  event.preventDefault();
}

function stopKeyboard(event) {
  if (['arrowright','arrowleft','arrowup','arrowdown','w','a','s','d'].includes(event.key.toLowerCase())) {
    player.isMoving = false;
    player.direction = 0;
  }
}

export function updatePlayer() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  if (player.isDead) return;

  if (player.isMoving) updatePosition();
  player.frame = (player.frame + (player.isMoving ? 0.15 : 0)) % 4;

  const image = bombermanFrames[Math.floor(player.frame)];
  if (image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, player.x - 16, player.y - 16, 32, 32);
  } else {
    ctx.fillStyle = '#25e6ff';
    ctx.shadowColor = '#25e6ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x - 11, player.y - 11, 22, 22);
    ctx.shadowBlur = 0;
  }
}

export function takeDamage() {
  if (player.isDead) return;
  player.lives--;

  if (player.lives <= 0) {
    player.isDead = true;
  } else {
    player.x = 1 * tileSize + 16;
    player.y = 1 * tileSize + 16;
  }
}

export function initPlayer(map, size, mapColumns, mapRows) {
  gameMap = map;
  tileSize = size;
  columns = mapColumns;
  rows = mapRows;

  const canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('keydown', handleKeyboard);
  window.addEventListener('keyup', stopKeyboard);
}
