import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const previewDir = resolve(root, 'telegram-preview');
const runtimeFiles = [
  'index.html',
  'privacy-policy.html',
  'main.js',
  'player.js',
  'bomb.js',
  'enemy.js',
  'hazards.js',
  'maze.js',
  'progress.js',
];
const runtimeImages = ['boomex-dog-sprite.png', 'bomb.png'];

await rm(previewDir, { recursive: true, force: true });
await mkdir(previewDir, { recursive: true });

for (const file of runtimeFiles) {
  await cp(resolve(root, file), resolve(previewDir, file));
}
await mkdir(resolve(previewDir, 'assets/images'), { recursive: true });
for (const image of runtimeImages) {
  await cp(resolve(root, 'assets/images', image), resolve(previewDir, 'assets/images', image));
}

console.log(`Preview isolado criado em ${previewDir}.`);
console.log('Mantém o SDK Telegram no HTML; não copia repositório, build Android, arte de loja ou credenciais.');
