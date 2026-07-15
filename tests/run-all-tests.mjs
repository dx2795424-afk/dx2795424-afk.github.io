// tests/run-all-tests.mjs — runs all E2E test files sequentially + captures S21 (jingcheng) screenshot
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { RESULTS_PATH } from './helpers.mjs';
import { PROJECT_ROOT } from './helpers.mjs';

const tests = [
  'test-p0-home.mjs',
  'test-flow-coverage.mjs',
];

function runOne(scriptPath) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(process.execPath, [scriptPath], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    });
    child.on('exit', (code) => {
      resolve({ script: path.basename(scriptPath), exitCode: code, durationMs: Date.now() - start });
    });
  });
}

// ─── Capture 03_jingcheng_choice.png by seeding S21 (jingcheng choice) ─────
async function captureJingchengShot() {
  const { launchBrowser, startStaticServer, seedGameState, shoot, RESULTS_PATH } = await import('./helpers.mjs');
  const { server, baseUrl } = await startStaticServer(path.join(PROJECT_ROOT, 'dist'));
  const browser = await launchBrowser();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  try {
    await seedGameState(page, baseUrl, 'S21');
    await page.waitForTimeout(500);
    await shoot(page, '03_jingcheng_choice.png');
    // Inline record (we'll merge at the end via appendResultsToFile)
    const r = { test: 'Snap-京城选择页', status: 'PASS', time: new Date().toISOString(),
                note: 'Seeded S21 and captured 03_jingcheng_choice.png.' };
    appendInline(r);
    console.log('[Snap-京城选择页] PASS');
  } catch (e) {
    appendInline({ test: 'Snap-京城选择页', status: 'FAIL', time: new Date().toISOString(), error: String(e) });
    console.error('[Snap-京城选择页] FAIL', e.message);
  } finally {
    await browser.close();
    server.close();
  }
}

function appendInline(entry) {
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8')); } catch (e) {}
  if (!Array.isArray(arr)) arr = [];
  arr.push(entry);
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(arr, null, 2));
}

(async () => {
  // Reset results file
  try { fs.unlinkSync(RESULTS_PATH); } catch (e) {}

  console.log('[run-all-tests] starting at', new Date().toISOString());
  const overallStart = Date.now();
  const results = [];
  for (const t of tests) {
    const scriptPath = path.join(PROJECT_ROOT, 'tests', t);
    console.log(`\n[run-all-tests] running ${t}`);
    const r = await runOne(scriptPath);
    results.push(r);
  }
  // Capture the S21 (jingcheng) screenshot independently.
  console.log('\n[run-all-tests] capturing 03_jingcheng_choice.png');
  await captureJingchengShot();

  const elapsed = ((Date.now() - overallStart) / 1000).toFixed(1);
  console.log(`\n[run-all-tests] done in ${elapsed}s. Results → ${RESULTS_PATH}`);
  // Print a pass/fail summary from the on-disk results
  try {
    const data = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
    const summary = data.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
    console.log('[run-all-tests] summary:', summary);
  } catch (e) {}
})();