import { player, updatePlayer, initPlayer, takeDamage, resetPlayer, setButtonDirection } from './player.js';
import { updateBombs, drawBombs, drawExplosions, placeBomb, resetBombs, getScore, resetScore } from './bomb.js';
import { Enemy } from './enemy.js';
import { generateMaze } from './maze.js';
import { resetHazards, updateHazards, drawHazards } from './hazards.js';
import { loadProgress, saveProgress } from './progress.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const telegram = window.Telegram?.WebApp;
if (telegram) { telegram.ready(); telegram.expand(); }
let activePointer = null;
document.querySelectorAll('[data-direction]').forEach(button => {
  button.addEventListener('pointerdown', event => {
    if (activePointer !== null) return;
    event.preventDefault(); activePointer = event.pointerId;
    button.setPointerCapture(event.pointerId);
    setButtonDirection(Number(button.dataset.direction));
  });
  const release = event => {
    if (event.pointerId !== activePointer) return;
    activePointer = null; setButtonDirection(0);
  };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
});
window.addEventListener('blur', () => { activePointer = null; setButtonDirection(0); });
document.addEventListener('visibilitychange', () => { if (document.hidden) {activePointer = null; setButtonDirection(0);} });


export const tileSize = 32;
export const columns = 13;
export const rows = 13;

canvas.width = columns * tileSize;
canvas.height = rows * tileSize;

// 0 = corredor, 1 = parede fixa, 2 = bloco destrutível.
const MAX_LEVEL = 25;
let level = loadProgress().unlockedLevel;
let scoreSaved = false;
let maze;
export let map = [];
const enemies = [];
function populateLevel() {
  maze = generateMaze(columns, rows, Math.random, Math.min(5, 2 + Math.floor((level - 1) / 5)));
  map.splice(0, map.length, ...maze.map);
  enemies.splice(0, enemies.length, ...maze.enemySpawns.map((p, i) =>
    new Enemy(p.x * tileSize + 16, p.y * tileSize + 16, tileSize, 0.72 + Math.min(level, 12) * 0.045 + i * 0.035)));
  resetHazards(map, maze.start, level);
}
populateLevel();

let lastTime = 0;
let bombCooldown = 0;
let finished = false;

function dropBomb() {
  if (finished || player.isDead || bombCooldown > 0) return;
  placeBomb(map, tileSize);
  bombCooldown = 500;
}

document.getElementById('bombButton')?.addEventListener('click', (event) => {
  event.preventDefault();
  if (!finished) dropBomb();
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    if (finished) restartGame();
    else if (!event.repeat) dropBomb();
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
  ctx.fillText(`FASE ${String(level).padStart(2,'0')}`, 10, 22);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffc85a';
  ctx.fillText(`PTS ${String(getScore()).padStart(5,'0')}`, canvas.width / 2, 22);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff4eaa';
  ctx.fillText(`VIDAS ${player.lives}`, canvas.width - 10, 22);
}

function showEndScreen(title, color, subtitle) {
  finished = true;
  const button = document.getElementById('restartButton');
  button.hidden = false;
  button.textContent = title.includes('COMPLETA') ? 'JOGAR DO INÍCIO' : (title.includes('CONCLUÍDA') ? (level >= MAX_LEVEL ? 'VER FINAL' : 'PRÓXIMA FASE') : 'TENTAR DE NOVO');
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
  if (document.hidden) { lastTime = 0; if (!finished) requestAnimationFrame(gameLoop); return; }
  const deltaTime = lastTime ? Math.min(timestamp - lastTime, 50) : 16.667;
  lastTime = timestamp;
  bombCooldown = Math.max(0, bombCooldown - deltaTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawHazards(ctx);
  drawHud();

  updateBombs(map, enemies, tileSize, columns, rows, deltaTime);
  drawBombs(ctx, tileSize);
  drawExplosions(ctx, tileSize);

  for (const enemy of enemies) {
    enemy.update(map, columns, rows, deltaTime, player);
    enemy.draw(ctx);
  }

  updateHazards(deltaTime, map);
  checkPlayerEnemyCollision();
  updatePlayer(deltaTime);

  if (enemies.length === 0 && !player.isDead && !finished) {
    if (!scoreSaved) { saveProgress({score:getScore(),completedLevel:level}); scoreSaved=true; }
    const finalCampaign = level >= MAX_LEVEL;
    showEndScreen(finalCampaign ? 'CAMPANHA COMPLETA!' : `FASE ${level} CONCLUÍDA`, '#48f5dc', `PONTOS ${getScore()} • REC ${loadProgress().bestScore}`);
  } else if (player.isDead && !finished) {
    if (!scoreSaved) { saveProgress({score:getScore(),gameEnded:true}); scoreSaved=true; }
    showEndScreen('GAME OVER', '#ff4eaa', `PONTOS ${getScore()} • REC ${loadProgress().bestScore}`);
  }

  if (!finished) requestAnimationFrame(gameLoop);
}

function restartGame() {
  if (!finished) return;
  const isGameOver = player.isDead;
  const completedCampaign = enemies.length === 0 && !isGameOver && level >= MAX_LEVEL;
  if (isGameOver) { level = loadProgress().unlockedLevel; resetScore(); }
  else if (completedCampaign) { level = 1; resetScore(); }
  else level = Math.min(MAX_LEVEL, level + 1);
  resetPlayer(isGameOver || completedCampaign); resetBombs(); bombCooldown=0; lastTime=0; finished=false; scoreSaved=false;
  populateLevel();
  document.getElementById('restartButton').hidden = true;
  requestAnimationFrame(gameLoop);
}

document.getElementById('restartButton').addEventListener('click', restartGame);

function init() {
  initPlayer(map, tileSize, columns, rows);
  requestAnimationFrame(gameLoop);
}

init();
