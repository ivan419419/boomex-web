import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(root, 'artifacts');
const outputPath = resolve(outputDir, 'boomex-offline.html');
const result = await build({
  entryPoints: [resolve(root, 'main.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome90'],
  minify: true,
  legalComments: 'none',
  write: false,
});

let javascript = result.outputFiles[0].text;
for (const filename of ['boomex-dog-sprite.png', 'bomb.png']) {
  const image = await readFile(resolve(root, 'assets/images', filename));
  const dataUrl = `data:image/png;base64,${image.toString('base64')}`;
  const assetPath = `assets/images/${filename}`;
  const replacement = JSON.stringify(dataUrl);
  const doubleQuoted = JSON.stringify(assetPath);
  const singleQuoted = `'${assetPath}'`;
  if (!javascript.includes(doubleQuoted) && !javascript.includes(singleQuoted)) {
    throw new Error(`O sprite ${filename} não foi encontrado no bundle.`);
  }
  javascript = javascript.split(doubleQuoted).join(replacement);
  javascript = javascript.split(singleQuoted).join(replacement);
}

let html = await readFile(resolve(root, 'index.html'), 'utf8');
const privacyPage = await readFile(resolve(root, 'privacy-policy.html'));
const privacyDataUrl = `data:text/html;charset=utf-8;base64,${privacyPage.toString('base64')}`;
const privacyHref = 'href="privacy-policy.html"';
if (!html.includes(privacyHref)) throw new Error('O link de privacidade não foi encontrado no HTML.');
html = html.replace(privacyHref, `href="${privacyDataUrl}"`);
const telegramTag = '<script src="https://telegram.org/js/telegram-web-app.js"></script>';
const moduleTag = '<script type="module" src="main.js"></script>';
if (!html.includes(telegramTag) || !html.includes(moduleTag)) {
  throw new Error('Os pontos de entrada esperados não foram encontrados em index.html.');
}
html = html.replace(telegramTag, '<!-- SDK remoto do Telegram removido: edição offline autônoma. -->');
html = html.replace(moduleTag, `<script>\n${javascript.replace(/<\/script/gi, '<\\/script')}\n</script>`);
if (html.includes(telegramTag) || html.includes(moduleTag)) {
  throw new Error('Não foi possível remover dependências do HTML offline.');
}
if (/\bsrc=(['"])https?:/i.test(html)) {
  throw new Error('O HTML final ainda contém script/imagem carregado de rede.');
}

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, html, 'utf8');
console.log(`HTML offline criado: ${outputPath} (${Buffer.byteLength(html)} bytes).`);
console.log('JavaScript e imagens estão embutidos; nenhuma conexão é necessária para iniciar a partida.');
