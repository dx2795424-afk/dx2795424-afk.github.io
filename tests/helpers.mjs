// tests/helpers.mjs — shared Playwright utilities for E2E tests
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PROJECT_ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
// PROJECT_ROOT resolves to the project root regardless of how the test is launched.

export const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'tests', 'screenshots');
export const RESULTS_PATH = path.join(PROJECT_ROOT, 'tests', 'playtest_results.json');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// ─── Tiny static file server for the built dist folder ─────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
};

export function startStaticServer(rootDir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        if (urlPath === '/') urlPath = '/index.html';
        const filePath = path.join(rootDir, urlPath);
        // Prevent path traversal
        if (!filePath.startsWith(rootDir)) {
          res.writeHead(403); res.end('forbidden'); return;
        }
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          res.writeHead(404); res.end('not found'); return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
        fs.createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500); res.end('err');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

// ─── Launch Chromium with sensible defaults ────────────────────────────────
export async function launchBrowser() {
  return chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
}

// ─── Page helpers ──────────────────────────────────────────────────────────
export async function clearAndGoto(page, baseUrl) {
  // Clear storage on the current origin first by hitting base URL with storage reset.
  await page.context().clearCookies();
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  });
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
}

export async function seedGameState(page, baseUrl, sceneId, extra = {}) {
  // Set the localStorage save so gameState.loadState() returns our scene on mount.
  const save = {
    currentScene: sceneId,
    gameStarted: sceneId !== 'S01',
    variables: {
      qingfeng: 50, fenggu: 50, minsheng: 50, yanhuo: 50, qinyou: 50, mingsheng: 50,
    },
    flags: {
      expression: null, ziyou: null, meat: null, cook: null, huai: null, governance: null,
      hangzhou_project: null, hangzhou_account: null,
      danzhou_teach: null, danzhou_life: null, tangzuo: null,
      account_dirty: false, life_cold: false,
    },
    visitedScenes: [sceneId],
    choiceHistory: [],
    itemsClicked: {},
    budget分配: {},
    audioEnabled: true,
    sceneHistory: [],
    currentChapter: 'meishan',
    ...extra,
  };
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((payload) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('dongpo_qingfengji_save', JSON.stringify(payload));
    } catch (e) {}
  }, save);
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
}

export async function getCurrentScene(page) {
  // Prefer the live DOM attribute (App.vue sets :data-scene="gameState.currentScene" on
  // every scene component). This avoids the 500ms debounced-save race with localStorage.
  return page.evaluate(() => {
    try {
      const el = document.querySelector('[data-scene]');
      if (el) {
        const s = el.getAttribute('data-scene');
        if (s) return s;
      }
      const raw = localStorage.getItem('dongpo_qingfengji_save');
      if (!raw) return null;
      return JSON.parse(raw).currentScene || null;
    } catch (e) { return null; }
  });
}

export async function getFlags(page) {
  return page.evaluate(() => {
    try {
      const raw = localStorage.getItem('dongpo_qingfengji_save');
      if (!raw) return null;
      return JSON.parse(raw).flags || null;
    } catch (e) { return null; }
  });
}

export async function isArchiveWallOpen(page) {
  return page.evaluate(() => {
    try {
      const raw = localStorage.getItem('dongpo_qingfengji_save');
      if (!raw) return false;
      return JSON.parse(raw).showArchiveWall === true;
    } catch (e) { return false; }
  });
}

export async function shoot(page, name) {
  const file = path.join(SCREENSHOTS_DIR, name);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

// ─── Higher-level: pick a choice card on a ChoiceOverlay ───────────────────
// Flow: click option → click confirm → click continue.
//
// NOTE on fact-card overlay: ChoiceMizhou* scenes open a FactAdaptationBook after
// confirm. The FAB's .fab-modal has pointer-events:auto which intercepts real clicks
// even when visually hidden (isVisible=false but DOM stays mounted). Its close
// handlers bail out because isVisible=false. Solution: dispatch click() directly
// on the continue button — this bypasses pointer-events hit-testing and fires the
// @click handler.
export async function pickChoice(page, { letter, closeFactCard = true } = {}) {
  const tid = `choice-option-${letter}`;
  await page.locator(`[data-testid="${tid}"]`).click();
  await page.waitForTimeout(150);
  // ChoiceOverlay auto-confirms on option-click (confirmedId is set immediately).
  // Wait briefly for feedback panel to appear, then click continue.
  await page.waitForTimeout(300);
  if (closeFactCard) {
    // Try to dismiss the fact card by dispatching click on its close button directly.
    await page.evaluate(() => {
      const btn = document.querySelector('.fab-collapse-btn') || document.querySelector('.fab-xbtn');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(150);
  }
  // Click continue via direct DOM dispatch — bypasses pointer-events intercepts.
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="btn-choice-continue"]');
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) throw new Error('continue button not found after confirm');
  await page.waitForTimeout(350);
}

// ─── Results aggregator (persists incrementally so cross-script results survive) ──
export const results = [];
export function recordResult(test, status, details) {
  results.push({ test, status, time: new Date().toISOString(), ...details });
  // Write incrementally — when tests run via spawn, each script has its own module
  // state, but writing to disk lets the runner aggregate at the end.
  try {
    fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  } catch (e) {}
}
export function dumpResults() {
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  return RESULTS_PATH;
}
// Also support appending to disk from runner (separate from module memory)
export function appendResultsToFile(extraResults) {
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
  } catch (e) {}
  const merged = [...existing, ...extraResults];
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(merged, null, 2));
  return merged;
}

export { PROJECT_ROOT };