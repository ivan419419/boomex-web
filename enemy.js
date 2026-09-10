const enemyImg = new Image();
enemyImg.src = 'assets/images/enemy_walk.png';

export class Enemy {
  constructor(x, y, tileSize) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.speed = 1.1;
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.turnTimer = 0;
  }

  update(map, columns, rows) {
    this.turnTimer++;
    if (this.turnTimer > 70 + Math.random() * 80) {
      this.dir = Math.random() > 0.5 ? 1 : -1;
      this.turnTimer = 0;
    }

    const nextX = this.x + this.speed * this.dir;
    const tx = Math.floor(nextX / this.tileSize);
    const ty = Math.floor(this.y / this.tileSize);

    if (
      tx <= 0 ||
      tx >= columns - 1 ||
      ty <= 0 ||
      ty >= rows - 1 ||
      map[ty]?.[tx] !== 0
    ) {
      this.dir *= -1;
    } else {
      this.x = nextX;
    }
  }

  draw(ctx) {
    if (enemyImg.complete && enemyImg.naturalWidth > 0) {
      ctx.drawImage(enemyImg, this.x - 14, this.y - 14, 28, 28);
    } else {
      ctx.fillStyle = '#ff3fa4';
      ctx.shadowColor = '#ff3fa4';
      ctx.shadowBlur = 12;
      ctx.fillRect(this.x - 12, this.y - 12, 24, 24);
      ctx.shadowBlur = 0;
    }
  }
}
