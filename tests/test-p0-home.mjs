// tests/test-p0-home.mjs — P0 首页测试
import { launchBrowser, startStaticServer, clearAndGoto, shoot, recordResult } from './helpers.mjs';
import { PROJECT_ROOT } from './helpers.mjs';
import path from 'node:path';

async function run() {
  const testName = 'P0-首页测试';
  const { server, port, baseUrl } = await startStaticServer(path.join(PROJECT_ROOT, 'dist'));
  const browser = await launchBrowser();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('[console] ' + msg.text());
  });

  try {
    // ── 1. localStorage.clear() + sessionStorage.clear() + refresh ─────────
    await clearAndGoto(page, baseUrl);
    const storageCleared = await page.evaluate(() => ({
      local: Object.keys(localStorage).length,
      session: Object.keys(sessionStorage).length,
    }));
    await shoot(page, '01_home.png');

    // ── 2. 首页标题出现 ────────────────────────────────────────────────────
    await page.waitForSelector('.main-title', { timeout: 8000 });
    const titleText = await page.locator('.main-title').first().innerText();
    const titleOK = titleText.includes('东坡清风纪');

    // ── 3. 开始按钮出现 ────────────────────────────────────────────────────
    await page.waitForSelector('[data-testid="btn-start-game"]', { timeout: 5000 });
    const startBtnVisible = await page.locator('[data-testid="btn-start-game"]').isVisible();

    // ── 4. 人生回溯不自动打开（showArchiveWall === false on home load） ────
    const archiveOpenOnLoad = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('dongpo_qingfengji_save');
        if (!raw) return false;
        return JSON.parse(raw).showArchiveWall === true;
      } catch (e) { return false; }
    });

    // ── 5. 点击开始 → 进入 S02 ────────────────────────────────────────────
    await page.locator('[data-testid="btn-start-game"]').click();
    await page.waitForTimeout(800);
    await shoot(page, '02_after_start_s02.png');

    const sceneAfterStart = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('dongpo_qingfengji_save');
        return raw ? JSON.parse(raw).currentScene : null;
      } catch (e) { return null; }
    });

    // ── 6. 人生回溯仍然没有自动打开 ────────────────────────────────────────
    const archiveStillClosed = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('dongpo_qingfengji_save');
        return raw ? JSON.parse(raw).showArchiveWall === true : false;
      } catch (e) { return false; }
    });

    const passed =
      titleOK &&
      startBtnVisible &&
      sceneAfterStart === 'S02' &&
      archiveOpenOnLoad === false &&
      archiveStillClosed === false;

    recordResult(testName, passed ? 'PASS' : 'FAIL', {
      checks: {
        localStorageCleared: storageCleared.local === 0,
        sessionStorageCleared: storageCleared.session === 0,
        titleVisible: titleOK,
        titleText,
        startBtnVisible,
        sceneAfterStart,
        archiveOpenOnLoad,
        archiveStillClosed,
      },
      pageErrors: errors.slice(0, 5),
    });

    console.log(`[${testName}] ${passed ? 'PASS' : 'FAIL'} — scene=${sceneAfterStart} title="${titleText}"`);
  } catch (e) {
    recordResult(testName, 'FAIL', { error: String(e), pageErrors: errors.slice(0, 5) });
    console.error(`[${testName}] FAIL`, e);
  } finally {
    await browser.close();
    server.close();
  }
}

run();