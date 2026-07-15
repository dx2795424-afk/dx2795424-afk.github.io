// tests/test-mobile-responsive.mjs — V1.1 Mobile Responsive Adaptation
//
// Verifies that the choice-overlay UI + scene rendering work cleanly at three
// target viewports:
//   • iPhone SE       : 375 × 667  (portrait)
//   • iPhone 12/13/14 : 390 × 844  (portrait)
//   • iPhone landscape: 812 × 375  (568 logical px after DPR, ≥ 500px height
//                                   rotated — 812×375 is portrait at source,
//                                   landscape mode uses orientation CSS)
//
// What we verify per viewport:
//   1. Home screen renders, start button is visible & clickable
//   2. S34 (SceneHuangzhou) loads without horizontal overflow
//   3. ChoiceOverlay on S37 (ChoiceCook) renders, options clickable,
//      .btn-continue becomes visible after a choice is made
//
// Per-run output:
//   - tests/screenshots/v11-mobile-{viewport}-{step}.png
//   - tests/playtest_results.json (incremental via helpers.recordResult)
//   - logs/v11_mobile_responsive.log (caller writes after run)

import path from 'node:path';
import fs from 'node:fs';
import {
  launchBrowser,
  startStaticServer,
  clearAndGoto,
  shoot,
  recordResult,
  seedGameState,
  getCurrentScene,
} from './helpers.mjs';
import { PROJECT_ROOT } from './helpers.mjs';

const SCREENSHOT_DIR = path.join(PROJECT_ROOT, 'tests', 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Three target viewports. isLandscape=true means we set the orientation CSS
// hint and the landscape media query should kick in (max-height: 500px).
const VIEWPORTS = [
  { name: 'iphone-se',   width: 375, height: 667, isLandscape: false },
  { name: 'iphone-12',   width: 390, height: 844, isLandscape: false },
  { name: 'iphone-12-l', width: 812, height: 375, isLandscape: true  },
];

// Helper: detect horizontal page overflow on the documentElement
async function detectOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasOverflow: doc.scrollWidth > doc.clientWidth + 1, // +1px tolerance
    };
  });
}

// Helper: check that an element is rendered and visible (display !== none,
// bounding box has positive area). Returns { present, visible, box }.
async function probe(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { present: false, visible: false, box: null };
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const visible =
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      rect.width > 0 &&
      rect.height > 0;
    return {
      present: true,
      visible,
      box: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    };
  }, selector);
}

// Helper: write a per-viewport result object into the shared log
function appendLog(logPath, lines) {
  const stamp = new Date().toISOString();
  const body = lines.map((l) => `[${stamp}] ${l}`).join('\n') + '\n';
  fs.appendFileSync(logPath, body, 'utf-8');
}

async function runOneViewport(vp, ctx, baseUrl, logPath) {
  const viewportLog = [];
  const page = await ctx.newPage();

  // DEV-mode debug helpers are only available when run via `vite` — they
  // aren't in the prod bundle. Use window.__jumpToScene from helpers.
  // Actually prod bundle doesn't include it; we use seedGameState + reload.

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('[console] ' + m.text());
  });

  viewportLog.push(`=== Viewport: ${vp.name} (${vp.width}x${vp.height}${vp.isLandscape ? ' landscape' : ''}) ===`);

  try {
    // ── Step A: Home screen ──────────────────────────────────────────────
    await clearAndGoto(page, baseUrl);
    await page.waitForSelector('.main-title', { timeout: 8000 });
    await shoot(page, `v11-mobile-${vp.name}-01-home.png`);

    const startBtn = await probe(page, '[data-testid="btn-start-game"]');
    const homeOverflow = await detectOverflow(page);
    viewportLog.push(`  [home] startBtn visible=${startBtn.visible} overflow=${homeOverflow.hasOverflow} (${homeOverflow.scrollWidth} > ${homeOverflow.clientWidth})`);

    // ── Step B: Navigate to S34 (SceneHuangzhou) ─────────────────────────
    await seedGameState(page, baseUrl, 'S34', { gameStarted: true });
    // seedGameState already reloads to '/'; wait for S34 to mount.
    await page.waitForSelector('[data-scene="S34"]', { timeout: 8000 });
    await page.waitForTimeout(600); // give intro animation a beat
    const s34Scene = await getCurrentScene(page);
    const s34Overflow = await detectOverflow(page);
    await shoot(page, `v11-mobile-${vp.name}-02-s34.png`);

    const continueBtnS34 = await probe(page, '.continue-btn');
    viewportLog.push(`  [s34]  scene=${s34Scene} continueBtn visible=${continueBtnS34.visible} overflow=${s34Overflow.hasOverflow}`);

    // ── Step C: Navigate to S37 (ChoiceCook) ─────────────────────────────
    await seedGameState(page, baseUrl, 'S37', { gameStarted: true });
    await page.waitForSelector('[data-scene="S37"]', { timeout: 8000 });
    await page.waitForTimeout(400);

    const overlayVisible = await probe(page, '.overlay-topbar');
    const choiceA = await probe(page, '[data-testid="choice-option-A"]');
    await shoot(page, `v11-mobile-${vp.name}-03-s37-pre.png`);
    viewportLog.push(`  [s37]  overlayVisible=${overlayVisible.visible} optionA visible=${choiceA.visible}`);

    // Read layout BEFORE click — Vue's scoped CSS sets `.choices-list`
    // flex-direction: column by default. Our landscape media query should
    // override to row.
    const choicesListLayout = await page.evaluate(() => {
      const el = document.querySelector('.choices-list');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return { display: cs.display, flexDirection: cs.flexDirection, flexWrap: cs.flexWrap };
    });
    viewportLog.push(`  [s37]  choices-list layout (pre-click)=${JSON.stringify(choicesListLayout)}`);

    // Click first choice — ChoiceOverlay sets confirmedId on click,
    // then .btn-continue becomes visible.
    await page.locator('[data-testid="choice-option-A"]').click();
    await page.waitForTimeout(200);

    const continueAfter = await probe(page, '[data-testid="btn-choice-continue"]');
    await shoot(page, `v11-mobile-${vp.name}-04-s37-after.png`);

    const s37Overflow = await detectOverflow(page);
    viewportLog.push(`  [s37]  btn-continue visible after pick=${continueAfter.visible} overflow=${s37Overflow.hasOverflow}`);

    // ── Aggregate ────────────────────────────────────────────────────────
    const checks = {
      home_startBtnVisible: startBtn.visible,
      home_noOverflow: !homeOverflow.hasOverflow,
      s34_loaded: s34Scene === 'S34',
      s34_continueVisible: continueBtnS34.visible,
      s34_noOverflow: !s34Overflow.hasOverflow,
      s37_overlayVisible: overlayVisible.visible,
      s37_choiceClickable: choiceA.visible,
      s37_btnContinueVisible: continueAfter.visible,
      s37_noOverflow: !s37Overflow.hasOverflow,
      // Landscape expects horizontal layout (read pre-click from choicesListLayout)
      landscape_rowLayout: vp.isLandscape
        ? (choicesListLayout && choicesListLayout.flexDirection === 'row')
        : (choicesListLayout && choicesListLayout.flexDirection === 'column'),
      noPageErrors: errors.length === 0,
    };

    const passed = Object.values(checks).every(Boolean);
    recordResult(`V1.1-mobile-${vp.name}`, passed ? 'PASS' : 'FAIL', {
      viewport: vp,
      checks,
      pageErrors: errors.slice(0, 5),
      choicesListLayout,
    });
    viewportLog.push(`  RESULT: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) viewportLog.push(`  Failed: ${Object.entries(checks).filter(([,v]) => !v).map(([k]) => k).join(', ')}`);
    if (errors.length) viewportLog.push(`  Errors: ${errors.slice(0, 3).join(' | ')}`);
  } catch (e) {
    recordResult(`V1.1-mobile-${vp.name}`, 'FAIL', { error: String(e), pageErrors: errors.slice(0, 5) });
    viewportLog.push(`  EXCEPTION: ${String(e)}`);
  } finally {
    await page.close();
  }

  appendLog(logPath, viewportLog);
}

async function run() {
  const logPath = path.join(PROJECT_ROOT, 'logs', 'v11_mobile_responsive.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  // Clear log so each run starts fresh
  fs.writeFileSync(logPath, `V1.1 Mobile Responsive Test Log\nGenerated: ${new Date().toISOString()}\n\n`, 'utf-8');

  appendLog(logPath, [`Starting test run…`, `Static server root: ${path.join(PROJECT_ROOT, 'dist')}`]);

  const { server, port, baseUrl } = await startStaticServer(path.join(PROJECT_ROOT, 'dist'));
  const browser = await launchBrowser();
  appendLog(logPath, [`Static server up at ${baseUrl}`, `Browser launched (chromium headless)`]);

  let totalPass = 0, totalFail = 0;
  try {
    for (const vp of VIEWPORTS) {
      // Each viewport gets its own context so the size is fresh.
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      try {
        await runOneViewport(vp, ctx, baseUrl, logPath);
      } finally {
        await ctx.close();
      }
    }

    // Tally from playtest_results.json (last 3 entries written by this run)
    const resultsPath = path.join(PROJECT_ROOT, 'tests', 'playtest_results.json');
    let results = [];
    try { results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8')); } catch (e) {}
    const ours = results.filter((r) => r.test && r.test.startsWith('V1.1-mobile-'));
    totalPass = ours.filter((r) => r.status === 'PASS').length;
    totalFail = ours.filter((r) => r.status === 'FAIL').length;
  } finally {
    await browser.close();
    server.close();
  }

  const summary = `\n=== SUMMARY ===\nPassed: ${totalPass} / ${VIEWPORTS.length}\nFailed: ${totalFail}\nFinished: ${new Date().toISOString()}\n`;
  fs.appendFileSync(logPath, summary, 'utf-8');
  console.log(summary);

  if (totalFail > 0) process.exitCode = 1;
}

run();