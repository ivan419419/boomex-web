import { copyFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'BOOMEX_UPLOAD_KEYSTORE',
  'BOOMEX_UPLOAD_STORE_PASSWORD',
  'BOOMEX_UPLOAD_KEY_ALIAS',
  'BOOMEX_UPLOAD_KEY_PASSWORD',
];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  throw new Error(`AAB release interrompido: faltam variáveis de assinatura (${missing.join(', ')}).`);
}

const keyStorePath = resolve(process.env.BOOMEX_UPLOAD_KEYSTORE);
await access(keyStorePath, constants.R_OK);
const env = { ...process.env, BOOMEX_UPLOAD_KEYSTORE: keyStorePath };
const run = (command, args, cwd) => execFileSync(command, args, { cwd, env, stdio: 'inherit' });

run('npm', ['run', 'build:web'], root);
run(resolve(root, 'node_modules/.bin/cap'), ['sync', 'android'], root);
const gradleArgs = ['bundleRelease'];
if (process.env.BOOMEX_AAPT2_OVERRIDE) {
  gradleArgs.push(`-Pandroid.aapt2FromMavenOverride=${process.env.BOOMEX_AAPT2_OVERRIDE}`);
}
run('./gradlew', gradleArgs, resolve(root, 'android'));

const source = resolve(root, 'android/app/build/outputs/bundle/release/app-release.aab');
const outputDir = resolve(root, 'artifacts');
const destination = resolve(outputDir, 'boomex-candidate-release.aab');
await mkdir(outputDir, { recursive: true });
await access(source, constants.R_OK);
await copyFile(source, destination);
console.log(`AAB assinado criado: ${destination}`);
