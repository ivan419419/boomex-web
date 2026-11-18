import { copyFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env };
for (const name of [
  'BOOMEX_UPLOAD_KEYSTORE',
  'BOOMEX_UPLOAD_STORE_PASSWORD',
  'BOOMEX_UPLOAD_KEY_ALIAS',
  'BOOMEX_UPLOAD_KEY_PASSWORD',
]) delete env[name];

const run = (command, args, cwd) => execFileSync(command, args, { cwd, env, stdio: 'inherit' });
run('npm', ['run', 'build:web'], root);
run(resolve(root, 'node_modules/.bin/cap'), ['sync', 'android'], root);

const gradleArgs = ['--no-daemon', 'clean', 'bundleRelease'];
const aapt2 = process.env.BOOMEX_AAPT2_OVERRIDE?.trim();
if (aapt2) gradleArgs.push(`-Pandroid.aapt2FromMavenOverride=${aapt2}`);
run('./gradlew', gradleArgs, resolve(root, 'android'));

const source = resolve(root, 'android/app/build/outputs/bundle/release/app-release.aab');
const outputDir = resolve(root, 'artifacts');
const destination = resolve(outputDir, 'boomex-v0.3-unsigned.aab');
await mkdir(outputDir, { recursive: true });
await access(source, constants.R_OK);
await copyFile(source, destination);
console.log(`AAB unsigned de validação criado: ${destination}`);
console.log('Nenhuma chave de assinatura foi lida ou usada. Este arquivo não é apto para upload até ser assinado com uma chave válida.');
