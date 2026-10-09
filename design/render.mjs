// Renders every asset from source. Usage: node render.mjs [icon|stills|gifs|all] [page]
import { chromium } from 'playwright';
import opentype from 'opentype.js';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WORD, STILLS, GIFS } from './scenes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const BRAND = join(ROOT, 'assets/brand');
const TMP = join(HERE, '.frames');
const GIFSICLE = process.env.GIFSICLE || 'gifsicle';
const url = (name, query = '') => pathToFileURL(join(HERE, 'src', `${name}.html`)).href + query;

// Wordmark and lockups as real outlines, so they render the same without the font installed.
function writeLogos(Kit) {
  const font = opentype.loadSync(join(HERE, 'fonts/Inter-Display-SemiBold.ttf'));
  const path = font.getPath(WORD, 0, 0, 200, { letterSpacing: -0.035 });
  const box = path.getBoundingBox();
  const d = path.toPathData(1);
  const w = Math.ceil(box.x2 - box.x1), h = Math.ceil(box.y2 - box.y1);
  const word = (fill) => `<path transform="translate(${-box.x1} ${-box.y1})" d="${d}" fill="${fill}"/>`;
  const icon = Kit.iconSVG({ uid: 'l', size: 260 }).replace('<svg ', '<svg x="-20" y="-20" ');
  const lockup = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 ${w + 294} 240" width="${w + 294}" height="240">${icon}<g transform="translate(264 ${110 - h / 2 - 2})">${word(fill)}</g></svg>`;
  writeFileSync(join(BRAND, 'logo-white.svg'), lockup('#f5f5f7'));
  writeFileSync(join(BRAND, 'logo-black.svg'), lockup('#000000'));
}

async function renderIcon(browser) {
  await import(pathToFileURL(join(HERE, 'src/kit.js')).href);
  const { Kit } = globalThis;
  writeFileSync(join(BRAND, 'icon.svg'), Kit.iconSVG());
  writeFileSync(join(BRAND, 'icon-small.svg'), Kit.iconSVG({ small: true }));
  writeLogos(Kit);
  mkdirSync(join(BRAND, 'png'), { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  for (const size of [16, 24, 32, 48, 64, 128, 256, 512, 1024]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block}</style>${Kit.iconSVG({ small: size <= (Kit.SMALL_MAX ?? 48), size })}`);
    await page.screenshot({ path: join(BRAND, 'png', `icon-${size}.png`), omitBackground: true });
  }
  await page.close();
  execFileSync('python3', ['-I', join(HERE, 'icons.py'), join(BRAND, 'png'), BRAND, WORD.toLowerCase()], { stdio: 'inherit' });
}

async function renderStill(browser, s) {
  const out = join(ROOT, s.out);
  mkdirSync(dirname(out), { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.scale });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error(`[${s.page}]`, e.message));
  await page.goto(url(s.page, s.query || ''));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out });
  await ctx.close();
  console.log('still', s.out);
}

async function renderGif(browser, g) {
  const dir = join(TMP, g.page);
  const out = join(ROOT, g.out);
  mkdirSync(dirname(out), { recursive: true });
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: g.w, height: g.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error(`[${g.page}]`, e.message));
  await page.goto(url(g.page));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const frames = Math.round(g.fps * g.dur);
  for (let i = 0; i < frames; i++) {
    // start picks the first frame, which is what still previews show
    await page.evaluate((t) => window.seek(t), (i / g.fps + (g.start || 0)) % g.dur);
    await page.screenshot({ path: join(dir, `${String(i).padStart(4, '0')}.png`) });
  }
  await ctx.close();
  const raw = join(dir, 'raw.gif');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(g.fps), '-i', join(dir, '%04d.png'),
    '-filter_complex', '[0:v]split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle',
    '-loop', '0', raw]);
  execFileSync(GIFSICLE, ['-O3', `--lossy=${g.lossy ?? 20}`, '--no-comments', '-o', out, raw]);
  rmSync(dir, { recursive: true, force: true });
  console.log('gif', g.out, `${(statSync(out).size / 1048576).toFixed(2)} MB`);
}

const [mode = 'all', only] = process.argv.slice(2);
mkdirSync(BRAND, { recursive: true });
const browser = await chromium.launch();
try {
  if (mode === 'icon' || mode === 'all') await renderIcon(browser);
  if (mode === 'stills' || mode === 'all') for (const s of STILLS) if (!only || s.page === only) await renderStill(browser, s);
  if (mode === 'gifs' || mode === 'all') for (const g of GIFS) if (!only || g.page === only) await renderGif(browser, g);
} finally {
  await browser.close();
}
rmSync(TMP, { recursive: true, force: true });
