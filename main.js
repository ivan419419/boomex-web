import { player, updatePlayer, initPlayer, takeDamage } from './player.js';
import { updateBombs, drawBombs, drawExplosions, placeBomb } from './bomb.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export const tileSize = 32;
export const columns = 13;
export const rows = 13;

canvas.width = columns * tileSize;
canvas.height = rows * tileSize;

// 0 = chão, 1 = parede fixa, 2 = bloco destrutível
export const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,2,2,2,2,2,2,2,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,2,0,2,0,2,2,0,2,1],
  [1,2,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,2,0,2,0,2,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,2,0,2,0,2,2,0,2,1],
  [1,2,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,2,0,2,0,2,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,2,2,2,2,2,2,2,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const enemies = [
  new Enemy(11 * tileSize + 16, 1 * tileSize + 16, tileSize),
  new Enemy(1 * tileSize + 16, 11 * tileSize + 16, tileSize),
  new Enemy(11 * tileSize + 16, 11 * tileSize + 16, tileSize)
];

let lastTime = 0;
let bombCooldown = 0;
let finished = false;

function dropBomb() {
  if (finished || player.isDead || bombCooldown > 0) return;
  placeBomb(map, tileSize);
  bombCooldown = 500;
}

canvas.addEventListener('click', () => {
  dropBomb();
});

document.getElementById('bombButton')?.addEventListener('click', (event) => {
  event.preventDefault();
  dropBomb();
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    dropBomb();
  }
});

function checkPlayerEnemyCollision() {
  for (const enemy of enemies) {
    if (Math.abs(player.x - enemy.x) < 22 && Math.abs(player.y - enemy.y) < 22) {
      takeDamage();
    }
  }
}

function drawMap() {
  ctx.fillStyle = '#06131d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const tile = map[y][x];
      const px = x * tileSize;
      const py = y * tileSize;

      // Piso azul escuro
      ctx.fillStyle = '#0a202c';
      ctx.fillRect(px, py, tileSize, tileSize);

      // Grade ciano
      ctx.strokeStyle = 'rgba(36, 153, 181, 0.24)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, tileSize, tileSize);

      // Linhas decorativas do piso
      ctx.strokeStyle = 'rgba(39, 202, 224, 0.18)';
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 8);
      ctx.lineTo(px + tileSize - 5, py + 8);
      ctx.moveTo(px + 8, py + 23);
      ctx.lineTo(px + tileSize - 10, py + 23);
      ctx.stroke();

      if (tile === 1) {
        // Parede fixa
        ctx.fillStyle = '#081923';
        ctx.fillRect(px, py, tileSize, tileSize);

        ctx.strokeStyle = '#164352';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, tileSize - 4, tileSize - 4);

        ctx.strokeStyle = 'rgba(37, 197, 218, 0.24)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 5, py + 11);
        ctx.lineTo(px + tileSize - 5, py + 11);
        ctx.moveTo(px + 5, py + 20);
        ctx.lineTo(px + tileSize - 5, py + 20);
        ctx.stroke();
      }

      if (tile === 2) {
        // Bloco destrutível
        ctx.save();
        ctx.shadowColor = '#e1a34b';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#29283b';
        ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#9d7546';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
        ctx.strokeStyle = 'rgba(255, 190, 90, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 8, py + 11);
        ctx.lineTo(px + tileSize - 9, py + 11);
        ctx.moveTo(px + 8, py + 22);
        ctx.lineTo(px + 18, py + 22);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function drawHud() {
  ctx.fillStyle = 'rgba(2, 9, 15, 0.9)';
  ctx.fillRect(0, 0, canvas.width, 34);

  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#7eeaff';
  ctx.fillText('BOOMEX // SECTOR 07', 10, 22);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff4eaa';
  ctx.fillText(`VIDAS ${player.lives}`, canvas.width - 10, 22);
}

function showEndScreen(title, color, subtitle) {
  finished = true;
  ctx.fillStyle = 'rgba(1, 6, 10, 0.84)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = '#d5f8ff';
  ctx.font = '13px monospace';
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 32);
  ctx.textAlign = 'left';
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime || 0;
  lastTime = timestamp;
  bombCooldown = Math.max(0, bombCooldown - deltaTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawHud();

  updateBombs(map, enemies, tileSize, columns, rows);
  drawBombs(ctx, tileSize);
  drawExplosions(ctx, tileSize);

  for (const enemy of enemies) {
    enemy.update(map, columns, rows);
    enemy.draw(ctx);
  }

  checkPlayerEnemyCollision();
  updatePlayer();

  if (enemies.length === 0) {
    showEndScreen('SETOR LIMPO', '#48f5dc', 'Toque para jogar novamente');
  } else if (player.isDead) {
    showEndScreen('GAME OVER', '#ff4eaa', 'Toque para tentar novamente');
  }

  if (!finished) requestAnimationFrame(gameLoop);
}

function init() {
  initPlayer(map, tileSize, columns, rows);
  requestAnimationFrame(gameLoop);
}

init();
