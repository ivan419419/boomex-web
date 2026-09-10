// ==================== ENEMY.JS — VERSÃO FINAL ====================
const enemyImg = new Image();
enemyImg.src = 'assets/images/enemy_walk.png';

export class Enemy {
    constructor(x, y, tileSize) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.speed = 1.2;
        this.dir = Math.random() > 0.5 ? 1 : -1;
        this.turnTimer = 0;
    }

    update(map) {
        this.turnTimer++;
        if (this.turnTimer > 60 + Math.random() * 60) {
            this.dir = Math.random() > 0.5 ? 1 : -1;
            this.turnTimer = 0;
        }
        this.x += this.speed * this.dir;
        const tx = Math.floor(this.x / this.tileSize);
        const ty = Math.floor(this.y / this.tileSize);
        if (tx < 1 || tx >= 11 || map[ty]?.[tx] === 1) {
            this.dir *= -1;
            this.x += this.speed * this.dir * 2;
        }
    }

    draw(ctx) {
        if (enemyImg.complete) {
            ctx.drawImage(enemyImg, this.x - 14, this.y - 14, 28, 28);
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(this.x - 12, this.y - 12, 24, 24);
        }
    }
}
