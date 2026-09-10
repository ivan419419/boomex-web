// ==================== PLAYER.JS — VERSÃO FINAL ====================
const bombermanFrames = [new Image(), new Image(), new Image(), new Image()];
bombermanFrames[0].src = 'assets/images/sprites_cortados/bomberman_walk_0.png';
bombermanFrames[1].src = 'assets/images/sprites_cortados/bomberman_walk_1.png';
bombermanFrames[2].src = 'assets/images/sprites_cortados/bomberman_walk_2.png';
bombermanFrames[3].src = 'assets/images/sprites_cortados/bomberman_walk_3.png';

export const player = {
    x: 2 * 32 + 16,
    y: 2 * 32 + 16,
    speed: 3.5,
    lives: 3,
    isDead: false,
    direction: 0,
    frame: 0,
    isMoving: false,
    startX: 0,
    startY: 0
};

function handleTouchStart(e) {
    e.preventDefault();
    if (player.isDead) return;
    const t = e.touches[0];
    player.startX = t.clientX;
    player.startY = t.clientY;
    player.isMoving = true;
}

function handleTouchMove(e) {
    if (!player.isMoving || player.isDead) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - player.startX;
    const dy = t.clientY - player.startY;
    if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 2) : (dy > 0 ? 4 : 3);
        updatePosition();
    }
}

function handleTouchEnd() {
    player.isMoving = false;
    player.direction = 0;
}

function updatePosition() {
    if (player.isDead) return;
    let nx = player.x, ny = player.y;
    if (player.direction === 1) nx += player.speed;
    if (player.direction === 2) nx -= player.speed;
    if (player.direction === 3) ny -= player.speed;
    if (player.direction === 4) ny += player.speed;
    player.x = Math.max(16, Math.min(384 - 16, nx));
    player.y = Math.max(16, Math.min(384 - 16, ny));
}

export function updatePlayer() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    if (player.isDead) return;
    if (player.isMoving) updatePosition();
    player.frame = (player.frame + (player.isMoving ? 0.15 : 0)) % 4;
    const img = bombermanFrames[Math.floor(player.frame)];
    if (img.complete) ctx.drawImage(img, player.x - 16, player.y - 16, 32, 32);
    else {
        ctx.fillStyle = '#c8102e';
        ctx.fillRect(player.x - 10, player.y - 12, 20, 24);
    }
}

export function takeDamage() {
    if (player.isDead) return;
    player.lives--;
    if (player.lives <= 0) player.isDead = true;
    else {
        player.x = 2 * 32 + 16;
        player.y = 2 * 32 + 16;
    }
}

export function initPlayer() {
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    console.log("✅ Player pronto!");
}
