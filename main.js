// ==================== MAIN.JS — VERSÃO FINAL COMPLETA ====================
import { player, updatePlayer, initPlayer, takeDamage } from './player.js';
import { updateBombs, drawBombs, drawExplosions, placeBomb } from './bomb.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export let tileSize = 32;
export let columns = 12;
export let rows = 12;

canvas.width = columns * tileSize;
canvas.height = rows * tileSize;

// ✅ MAPA — Parede=1, Bloco Quebrável=2, Chão=0
export let map = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,2,0,0,0,0,1],
    [1,2,1,0,1,0,1,0,1,0,2,1],
    [1,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,2,0,0,0,0,1],
    [1,2,1,0,1,0,1,0,1,0,2,1],
    [1,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

let enemies = [
    new Enemy(9 * tileSize + 16, 1 * tileSize + 16, tileSize),
    new Enemy(1 * tileSize + 16, 9 * tileSize + 16, tileSize),
    new Enemy(9 * tileSize + 16, 9 * tileSize + 16, tileSize)
];

let lastTime = 0;
let bombCooldown = 0;

// 🎯 COLOCAR BOMBA — Clique / Toque
canvas.addEventListener('click', () => {
    if (bombCooldown > 0 || player.isDead) return;
    placeBomb(map);
    bombCooldown = 500;
});

// 🔄 COLISÃO JOGADOR ↔ INIMIGO
function checkPlayerEnemyCollision() {
    for (const enemy of enemies) {
        const dx = Math.abs(player.x - enemy.x);
        const dy = Math.abs(player.y - enemy.y);
        if (dx < 24 && dy < 24) {
            takeDamage();
        }
    }
}

// 🎨 DESENHAR MAPA
function drawMap() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const tile = map[y][x];
            if (tile === 1) {
                ctx.fillStyle = "#555566";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (tile === 2) {
                ctx.fillStyle = "#8854d0";
                ctx.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
            } else {
                ctx.fillStyle = "#2a2a3a";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

// 🔁 LOOP PRINCIPAL DO JOGO
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime || 0;
    lastTime = timestamp;
    bombCooldown = Math.max(0, bombCooldown - deltaTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ❤️ BARRA DE VIDAS
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Vidas:", 12, 28);
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < player.lives ? "#ff4757" : "#444444";
        ctx.fillText("❤️", 85 + i * 32, 30);
    }

    // 🏷️ CONTAGEM DE INIMIGOS
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`Inimigos: ${enemies.length}`, canvas.width - 130, 28);

    drawMap();
    updateBombs(map, enemies);
    drawBombs(ctx);
    drawExplosions(ctx);

    for (let enemy of enemies) {
        enemy.update(map);
        enemy.draw(ctx);
    }

    checkPlayerEnemyCollision();
    updatePlayer();

    // 🏆 VITÓRIA
    if (enemies.length === 0) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 42px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🎉 VITÓRIA!", canvas.width/2, canvas.height/2);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Toque para próxima fase", canvas.width/2, canvas.height/2 + 55);
        canvas.onclick = () => window.location.reload();
        return;
    }

    // 💀 GAME OVER
    if (player.isDead) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff4757";
        ctx.font = "bold 42px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("💥 GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Toque para tentar novamente", canvas.width/2, canvas.height/2 + 60);
        canvas.onclick = () => window.location.reload();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function init() {
    initPlayer();
    requestAnimationFrame(gameLoop);
}
init();
