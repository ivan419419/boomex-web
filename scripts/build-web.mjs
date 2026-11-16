import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = resolve(root, 'www');
const runtimeFiles = [
  'index.html',
  'main.js',
  'player.js',
  'bomb.js',
  'enemy.js',
  'hazards.js',
  'maze.js',
  'progress.js',
];

await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

for (const file of runtimeFiles) {
  await cp(resolve(root, file), resolve(webDir, file));
}
await cp(resolve(root, 'assets/images'), resolve(webDir, 'assets/images'), { recursive: true });

const indexPath = resolve(webDir, 'index.html');
const html = await readFile(indexPath, 'utf8');
const telegramSdk = /<script\s+src=(['"])https:\/\/telegram\.org\/js\/telegram-web-app\.js\1><\/script>/i;
if (!telegramSdk.test(html)) {
  throw new Error('Não foi possível localizar o script do Telegram no index.html; revise a origem antes de empacotar.');
}
await writeFile(
  indexPath,
  html.replace(telegramSdk, '<!-- SDK Telegram omitido na cópia Android standalone. -->'),
  'utf8',
);

console.log(`Jogo copiado para ${webDir} (${runtimeFiles.length} arquivos JS/HTML e assets/images).`);
console.log('A cópia Android não carrega o SDK remoto do Telegram; o código original permaneceu inalterado.');
