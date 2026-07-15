// tests/test-p2-huangzhou-fix.mjs — focused regression test for P2 黄州 chain.
//
// Goal: prove the S35 → S42 黄州 chain advances through every vn-next-btn
// (and dialogue button) without leaving the player stuck on a half-typed
// text.  Each Scene that uses DialogueBox + showNextBtn must surface a
// clickable .vn-next-btn within ~400ms of a single dialogue click.
//
// Why a separate test?  test-flow-coverage.mjs bundles P1-P4 and any
// single-chain regression collapses the whole harness.  This file
// isolates S38 + S42 (the two .vn-next-btn surfaces) so a regression
// shows up with a clear, narrow error.

import { launchBrowser, startStaticServer, seedGameState, shoot,
         pickChoice, getCurrentScene, recordResult } from './helpers.mjs';
import { PROJECT_ROOT } from './helpers.mjs';
import path from 'node:path';

async function run() {
  const { server, port, baseUrl } = await startStaticServer(path.join(PROJECT_ROOT, 'dist'));
  const browser = await launchBrowser();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()); });

  const checks = [];

  function record(stage, ok, info = {}) {
    checks.push({ stage, ok, ...info });
    console.log(`[P2-huangzhou-fix] ${ok ? 'PASS' : 'FAIL'}  ${stage}`, info);
  }

  async function clickAndWaitNextBtn(label, scene, btnSelector = '.vn-next-btn', waitMs = 700) {
    // Wait for dialogue to be present, click once, then verify .vn-next-btn appears.
    await page.waitForSelector('.dialogue-box', { timeout: 10000 });
    await page.waitForTimeout(400); // mid-typing
    const dialogueClicked = await page.evaluate(() => {
      const el = document.querySelector('.dialogue-box');
      if (!el) return false;
      el.click();
      return true;
    });
    if (!dialogueClicked) {
      record(`${label}-dialogue-click`, false, { scene, reason: 'no .dialogue-box' });
      return false;
    }
    await page.waitForTimeout(waitMs);
    const found = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const cs = getComputedStyle(el);
      const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0;
      const rect = el.getBoundingClientRect();
      return visible && rect.width > 0 && rect.height > 0;
    }, btnSelector);
    if (!found) {
      record(`${label}-vn-next-btn-visible`, false, { scene, btnSelector });
      return false;
    }
    record(`${label}-vn-next-btn-visible`, true, { scene });
    const clicked = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.click();
      return true;
    }, btnSelector);
    if (!clicked) {
      record(`${label}-btn-click`, false, { scene });
      return false;
    }
    await page.waitForTimeout(600);
    return true;
  }

  try {
    // ─── 1. S35 BudgetGame unlock ──────────────────────────────────────────
    await seedGameState(page, baseUrl, 'S35');
    let cur = await getCurrentScene(page);
    record('seed-S35', cur === 'S35', { cur });

    await page.locator('[data-testid="budget-confirm-button"]').waitFor({ timeout: 10000 });
    const plusButtons = page.locator('.budget-item .btn-plus');
    await plusButtons.nth(2).click(); await page.waitForTimeout(80);
    await plusButtons.nth(2).click(); await page.waitForTimeout(80);
    await plusButtons.nth(2).click(); await page.waitForTimeout(80);
    await page.locator('[data-testid="budget-confirm-button"]').click({ force: true });
    await page.waitForTimeout(2000);
    cur = await getCurrentScene(page);
    record('S35→S36-budget-confirm', cur === 'S36', { cur });

    // ─── 2. S36 ChoiceMeat → S37 ───────────────────────────────────────────
    await pickChoice(page, { letter: 'A', closeFactCard: false });
    cur = await getCurrentScene(page);
    record('S36→S37-Meat-A', cur === 'S37', { cur });

    // ─── 3. S37 ChoiceCook → S38 ───────────────────────────────────────────
    await pickChoice(page, { letter: 'A', closeFactCard: false });
    cur = await getCurrentScene(page);
    record('S37→S38-Cook-A', cur === 'S38', { cur });

    // ─── 4. S38 SceneDongpo: dialogue click → .vn-next-btn visible (THE FIX)
    const s38OK = await clickAndWaitNextBtn('S38-dongpo', 'S38', '[data-testid="btn-next-S38"]');
    if (!s38OK) throw new Error('S38 .vn-next-btn not visible after dialogue click (regression of P2 FAIL)');
    cur = await getCurrentScene(page);
    record('S38→S39', cur === 'S39', { cur });

    // ─── 5. S39 SceneMoonlight: .btn-continue ──────────────────────────────
    await page.waitForSelector('.btn-continue', { timeout: 10000 });
    await page.waitForTimeout(200);
    await page.evaluate(() => { const el = document.querySelector('.btn-continue'); if (el) el.click(); });
    await page.waitForTimeout(600);
    cur = await getCurrentScene(page);
    record('S39→S40-moonlight', cur === 'S40', { cur });

    // ─── 6. S40 SceneExplore: discover all 3 explore points, then btn-next-S42 → S41 ──
    // canProceed = discoveredPoints.length === 3. Temple has 1s delay.
    await page.locator('[data-testid="explore-moonlight"]').click();
    await page.waitForTimeout(200);
    await page.locator('[data-testid="explore-bamboo"]').click();
    await page.waitForTimeout(200);
    await page.locator('[data-testid="explore-temple"]').click();
    // temple takes 1000ms to mark as discovered (plus showHuaiMin dwell)
    await page.waitForTimeout(2400);
    await page.waitForSelector('[data-testid="btn-next-S42"]', { timeout: 10000 });
    await page.waitForTimeout(200);
    await page.evaluate(() => { const el = document.querySelector('[data-testid="btn-next-S42"]'); if (el) el.click(); });
    await page.waitForTimeout(600);
    cur = await getCurrentScene(page);
    record('S40→S41-explore', cur === 'S41', { cur });

    // ─── 7. S41 ChoiceHuaiMin → S42 ────────────────────────────────────────
    await pickChoice(page, { letter: 'A', closeFactCard: false });
    cur = await getCurrentScene(page);
    record('S41→S42-huaimin-A', cur === 'S42', { cur });

    // ─── 8. S42 SceneMoonComment: dialogue click → .vn-next-btn → S44 ────
    // After 600ms (already passed via pickChoice + subsequent waits), the
    // dialogue is mid-typing; click once and expect btn to surface.
    const s42OK = await clickAndWaitNextBtn('S42-mooncomment', 'S42', '[data-testid="btn-next-S42"]');
    if (!s42OK) throw new Error('S42 .vn-next-btn not visible after dialogue click');
    cur = await getCurrentScene(page);
    record('S42→S44-or-S43', ['S43', 'S44'].includes(cur), { cur });

    await shoot(page, '08_chengtian_scene.png');

    const passed = checks.every((c) => c.ok);
    recordResult('P2-黄州修复', passed ? 'PASS' : 'FAIL', {
      sequence: ['S35', 'S36', 'S37', 'S38', 'S39', 'S40', 'S41', 'S42', cur],
      reached: cur,
      checks,
      pageErrors: errors.slice(0, 5),
    });
    console.log(`[P2-黄州修复] ${passed ? 'PASS' : 'FAIL'} — reached ${cur}, ${checks.length} checks`);
  } catch (e) {
    recordResult('P2-黄州修复', 'FAIL', {
      error: String(e),
      checks,
      reached: await getCurrentScene(page).catch(() => 'unknown'),
      pageErrors: errors.slice(0, 5),
    });
    console.error('[P2-黄州修复] FAIL', e.message);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
}

run();
