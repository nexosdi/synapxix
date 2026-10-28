#!/usr/bin/env node
/**
 * Publica el Primer Pulso dentro de la landing (synapxix.com/pulso).
 *
 * Compila la app team con base `/pulso/` y la copia a `public/pulso/` del
 * repo de la landing. La API no viaja: la landing la redirige con su
 * vercel.json (`/api/team/*` → servidor en Railway).
 *
 *   node scripts/publish-pulso.mjs [ruta-a-la-landing]
 *
 * Por defecto la landing está junto a este repo: ../landing-gamificamente.
 * Después: commit y push en la landing (una rama para probar en la vista
 * previa de Vercel; main publica en synapxix.com).
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const landing = resolve(process.argv[2] ?? resolve(root, '..', 'landing-gamificamente'));
const target = resolve(landing, 'public', 'pulso');

if (!existsSync(resolve(landing, 'astro.config.mjs'))) {
  console.error(`No encuentro la landing en ${landing}`);
  process.exit(1);
}

execSync('npx nx build team --configuration=production --base-href=/pulso/ --skip-nx-cache', { cwd: root, stdio: 'inherit' });

rmSync(target, { recursive: true, force: true });
cpSync(resolve(root, 'dist', 'team', 'browser'), target, { recursive: true });
const commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
writeFileSync(resolve(target, 'VERSION.txt'), `nexosdi/synapxix@${commit}\n`);

console.log(`\nPrimer Pulso (${commit}) copiado a ${target}`);
