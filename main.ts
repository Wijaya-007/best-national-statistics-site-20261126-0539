// StatDesk Indonesia — program penyerahan (Node 22, stdlib saja).
//
// Situsnya adalah file statis di app/ (index.html + CSS + modul ES, tanpa
// build step) dan tangkapan layarnya di screenshots/. Program ini menyalin
// keduanya ke direktori keluaran lalu menulis /output/dossier.json dengan
// buildDossier dari vendor/makefun-frontend.ts — ringkasan yang dibaca juri
// (tangkapan layar, berkas first load beserta ukurannya, dan sumber situs).
// vendor/makefun-frontend.ts dibiarkan apa adanya: penilai mengharuskan
// dossier.json sama persis byte demi byte dengan yang ditulis salinannya.
//
// Di luar kontainer penilai, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Semua jalur dibaca relatif ke lokasi berkas ini, bukan process.cwd().
const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copySite(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    throw new Error(`missing directory: ${sourceDir}`);
  }
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    total += entry.isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

// Penilai menolak entri tanpa tangkapan layar, jadi gagal cepat di sini
// ketimbang membiarkan buildDossier yang menolaknya belakangan.
function checkScreenshots(dir) {
  const shots = readdirSync(dir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`screenshots/ must hold 3 or 4 images, found ${shots.length}`);
  }
  return shots;
}

function writeDossier() {
  const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(out, 'dossier.json'), dossier);
  return dossier;
}

mkdirSync(out, { recursive: true });
copySite(join(here, 'app'), join(out, 'app'));
copySite(join(here, 'screenshots'), join(out, 'screenshots'));
const shots = checkScreenshots(join(out, 'screenshots'));

const dossierText = writeDossier();
const appFiles = countFiles(join(out, 'app'));
console.log(`StatDesk Indonesia: ${appFiles} app files, ${shots.length} screenshots, dossier ${Buffer.byteLength(dossierText, 'utf8')} bytes -> ${out}`);
