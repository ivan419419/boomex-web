// ==================== BOMB.JS — VERSÃO FINAL COMPLETA ====================
import { player, takeDamage } from './player.js';

const bombImg = new Image();
bombImg.src = 'assets/images/bomb.png';

const explosionCenter = new Image();
explosionCenter.src = 'assets/images/sprites_cortados/sprite_010.png'; // ← AJUSTA O Nº!

const explosionH = new Image();
explosionH.src = 'assets/images/sprites_cortados/sprite_011.png'; // ← AJUSTA O Nº!

const explosionV = new Image();
explosionV.src = 'assets/images/sprites_cortados/sprite_012.png'; // ← AJUSTA O Nº!

let bombs = [];
let explosions = [];
const MAX_BOMBS = 1;
const BOMB_TIMER = 3000;
const EXPLOSION_DURATION = 600;
const EXPLOSION_RANGE = 2;
const tileSize = 32;

export let enemiesDefeated = 0;

export function placeBomb(map) {
    if (bombs.length >= MAX_BOMBS) return;
    const tileX = Math.floor(player.x / tileSize);
    const tileY = Math.floor(player.y / tileSize);
    if (bombs.some(b => b.tileX === tileX && b.tileY === tileY)) return;
    bombs.push({
        tileX, tileY,
        x: tileX * tileSize + tileSize / 2,
        y: tileY * tileSize + tileSize / 2,
        timer: BOMB_TIMER,
        placedAt: Date.now()
    });
    console.log(`💣 Bomba em (${tileX}, ${tileY})`);
}

function detonateBomb(bomb, map, enemies) {
    createExplosion(bomb.tileX, bomb.tileY, 'center', enemies);
    const directions = [
        { dx: 1, dy: 0, type: 'horizontal' },
        { dx: -1, dy: 0, type: 'horizontal' },
        { dx: 0, dy: -1, type: 'vertical' },
        { dx: 0, dy: 1, type: 'vertical' }
    ];
    directions.forEach(dir => {
        for (let i = 1; i <= EXPLOSION_RANGE; i++) {
            const cx = bomb.tileX + dir.dx * i;
            const cy = bomb.tileY + dir.dy * i;
            if (cx < 0 || cx >= 12 || cy < 0 || cy >= 12) break;
            if (map[cy][cx] === 1) break;
            if (map[cy][cx] === 2) {
                map[cy][cx] = 0;
                createExplosion(cx, cy, dir.type, enemies);
                break;
            }
            createExplosion(cx, cy, dir.type, enemies);
        }
    });
}

function createExplosion(tileX, tileY, type, enemies) {
    explosions.push({
        tileX, tileY,
        x: tileX * tileSize + tileSize / 2,
        y: tileY * tileSize + tileSize / 2,
        type,
        spawnedAt: Date.now()
    });
    const distPlayer = Math.hypot(player.x / tileSize - tileX, player.y / tileSize - tileY);
    if (distPlayer < 0.8) takeDamage();
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const distEnemy = Math.hypot(e.x / tileSize - tileX, e.y / tileSize - tileY);
        if (distEnemy < 0.8) {
            enemies.splice(i, 1);
            enemiesDefeated++;
        }
    }
}

export function updateBombs(map, enemies) {
    const now = Date.now();
    bombs = bombs.filter(b => {
        if (now - b.placedAt >= b.timer) {
            detonateBomb(b, map, enemies);
            return false;
        }
        return true;
    });
    explosions = explosions.filter(e => (now - e.spawnedAt) < EXPLOSION_DURATION);
}

export function drawBombs(ctx) {
    bombs.forEach(b => {
        if (bombImg.complete) ctx.drawImage(bombImg, b.x - 16, b.y - 16, 32, 32);
        const t = Math.ceil((b.timer - (Date.now() - b.placedAt)) / 1000);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(t, b.x, b.y + 4);
    });
}

export function drawExplosions(ctx) {
    explosions.forEach(e => {
        let img = e.type === 'center' ? explosionCenter : e.type === 'horizontal' ? explosionH : explosionV;
        if (img?.complete) ctx.drawImage(img, e.x - 16, e.y - 16, 32, 32);
    });
}
