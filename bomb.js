import { player, takeDamage } from './player.js';

const bombImg = new Image();
bombImg.src = 'assets/images/bomb.png';

const explosionCenter = new Image();
explosionCenter.src = 'assets/images/sprites_cortados/sprite_010.png';

const explosionH = new Image();
explosionH.src = 'assets/images/sprites_cortados/sprite_011.png';

const explosionV = new Image();
explosionV.src = 'assets/images/sprites_cortados/sprite_012.png';

let bombs = [];
let explosions = [];
const MAX_BOMBS = 1;
const BOMB_TIMER = 3000;
const EXPLOSION_DURATION = 600;
const EXPLOSION_RANGE = 2;

export function placeBomb(map, tileSize) {
  if (bombs.length >= MAX_BOMBS) return;

  const tileX = Math.floor(player.x / tileSize);
  const tileY = Math.floor(player.y / tileSize);

  if (map[tileY]?.[tileX] !== 0) return;
  if (bombs.some(bomb => bomb.tileX === tileX && bomb.tileY === tileY)) return;

  bombs.push({
    tileX,
    tileY,
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
    timer: BOMB_TIMER,
    placedAt: Date.now()
  });
}

function createExplosion(tileX, tileY, type, enemies, tileSize) {
  explosions.push({
    tileX,
    tileY,
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
    type,
    spawnedAt: Date.now()
  });

  const playerTileX = Math.floor(player.x / tileSize);
  const playerTileY = Math.floor(player.y / tileSize);
  if (playerTileX === tileX && playerTileY === tileY) takeDamage();

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemyTileX = Math.floor(enemies[i].x / tileSize);
    const enemyTileY = Math.floor(enemies[i].y / tileSize);
    if (enemyTileX === tileX && enemyTileY === tileY) enemies.splice(i, 1);
  }
}

function detonateBomb(bomb, map, enemies, tileSize, columns, rows) {
  createExplosion(bomb.tileX, bomb.tileY, 'center', enemies, tileSize);

  const directions = [
    { dx: 1, dy: 0, type: 'horizontal' },
    { dx: -1, dy: 0, type: 'horizontal' },
    { dx: 0, dy: -1, type: 'vertical' },
    { dx: 0, dy: 1, type: 'vertical' }
  ];

  for (const direction of directions) {
    for (let distance = 1; distance <= EXPLOSION_RANGE; distance++) {
      const x = bomb.tileX + direction.dx * distance;
      const y = bomb.tileY + direction.dy * distance;

      if (x < 0 || x >= columns || y < 0 || y >= rows) break;
      if (map[y][x] === 1) break;

      if (map[y][x] === 2) {
        map[y][x] = 0;
        createExplosion(x, y, direction.type, enemies, tileSize);
        break;
      }

      createExplosion(x, y, direction.type, enemies, tileSize);
    }
  }
}

export function updateBombs(map, enemies, tileSize, columns, rows) {
  const now = Date.now();

  bombs = bombs.filter(bomb => {
    if (now - bomb.placedAt >= bomb.timer) {
      detonateBomb(bomb, map, enemies, tileSize, columns, rows);
      return false;
    }
    return true;
  });

  explosions = explosions.filter(
    explosion => now - explosion.spawnedAt < EXPLOSION_DURATION
  );
}

export function drawBombs(ctx, tileSize) {
  for (const bomb of bombs) {
    if (bombImg.complete && bombImg.naturalWidth > 0) {
      ctx.drawImage(bombImg, bomb.x - 16, bomb.y - 16, tileSize, tileSize);
    } else {
      ctx.fillStyle = '#f5f5f5';
      ctx.beginPath();
      ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    const seconds = Math.ceil((bomb.timer - (Date.now() - bomb.placedAt)) / 1000);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(seconds, bomb.x, bomb.y + 4);
  }
}

export function drawExplosions(ctx, tileSize) {
  for (const explosion of explosions) {
    const image = explosion.type === 'center'
      ? explosionCenter
      : explosion.type === 'horizontal' ? explosionH : explosionV;

    if (image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, explosion.x - 16, explosion.y - 16, tileSize, tileSize);
    } else {
      ctx.fillStyle = '#ffca3a';
      ctx.shadowColor = '#ff4eaa';
      ctx.shadowBlur = 12;
      ctx.fillRect(explosion.x - 10, explosion.y - 10, 20, 20);
      ctx.shadowBlur = 0;
    }
  }
}
