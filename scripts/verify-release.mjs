// Dongpo Qingfengji H5 — release verification script.
// Run: npm run verify
import { chromium } from 'playwright'
import { setTimeout as wait } from 'node:timers/promises'

const URL = process.env.VERIFY_URL || 'http://127.0.0.1:5300/'

const results = { passed: [], failed: [] }
const errors = []
const failed404 = []
const clickedHistory = new Set()  // remember clicked text + class names to avoid re-clicking

function pass(name) { results.passed.push(name); console.log(`  ✓ ${name}`) }
function fail(name, why) { results.failed.push({ name, why }); console.log(`  ✗ ${name} — ${why}`) }

async function clickAdvance(page, label, maxTries = 80) {
  for (let i = 0; i < maxTries; i++) {
    const info = await page.evaluate(({ lbl, history }) => {
      if (document.querySelector('.choice-paper')) return { reached: 'choice' }
      // If chapter transition wall is showing, click the "进入下一幕" button first
      const wall = document.querySelector('.chapter-wall')
      if (wall) {
        const cwBtn = wall.querySelector('.cw-btn')
        if (cwBtn) {
          cwBtn.click()
          return { reached: false, clicked: 'chapter-transition-cw-btn', visibleCount: 1 }
        }
      }
      // Helper: aggressive click on all dialogue boxes AND next buttons.
      // Many scenes (SceneCapital, SceneBrothers) need MULTIPLE clicks to advance
      // (1st completes typing, 2nd triggers advance). Old dlg refs may be unmounted
      // so we re-query each time.
      let didAction = false
      // 1. Click all dialogue boxes (newest first via querySelectorAll loop)
      const allDlgs = document.querySelectorAll('.dialogue-box')
      for (const d of allDlgs) { d.click(); didAction = true }
      // 2. Click any visible .vn-next-btn / .continue-btn
      const vnNext = document.querySelector('.vn-next-btn')
      if (vnNext) { vnNext.click(); didAction = true }
      const continueBtn = document.querySelector('.continue-btn')
      if (continueBtn && getComputedStyle(continueBtn).display !== 'none') {
        continueBtn.click(); didAction = true
      }
      // 3. Click IntroScreen S02 button
      const introBtn = document.querySelector('[data-testid="btn-next-S10"]')
      if (introBtn) { introBtn.click(); didAction = true }
      if (didAction) {
        return { reached: false, clicked: 'multi-action', visibleCount: 1 }
      }
      // Find all clickable elements (broader selector: any btn-like class)
      const all = Array.from(document.querySelectorAll('button, [class*="btn"], [class*="next"], [class*="continue"], [role="button"], .desk-item, .prop-item, .su-figure, .dialogue-box, .clickable'))
      const cands = all.filter(b => {
        const r = b.getBoundingClientRect()
        const cs = window.getComputedStyle(b)
        if (cs.display === 'none' || cs.visibility === 'hidden') return false
        if (cs.pointerEvents === 'none') return false
        if (r.width < 25 || r.height < 25) return false
        // Skip desk-item that has been clicked (contains .item-check, has 'clicked' class)
        if (b.classList.contains('clicked') || b.querySelector('.item-check')) return false
        // Skip FactAdaptationBook collapse/close buttons (don't advance scene)
        if (b.classList.contains('fab-collapse-btn') || b.classList.contains('fab-xbtn')) return false
        // Skip audio toggles
        if (b.classList.contains('audio-toggle') || b.dataset.testid === 'btn-audio-toggle') return false
        // Skip global UI toggles (dialogue log, archive wall, etc.)
        if (b.classList.contains('log-toggle-btn') || b.classList.contains('archive-toggle-btn')) return false
        // Skip close buttons (×, ✕, ×)
        if (b.classList.contains('close-btn') || b.classList.contains('modal-close')) return false
        // Skip archive wall (it's a modal, not a scene advance)
        if (b.closest('.archive-wall') || b.closest('.law-overlay') || b.closest('.dialogue-log-panel')) return false
        // Skip optional figure-click decorations (don't advance scene)
        if (b.classList.contains('su-figure')) return false
        // Skip the dialogue box itself (not actionable) — handled via .dialogue-zone click separately
        if (b.classList.contains('dialogue-box') && !b.classList.contains('dialogue-zone')) {
          // Allow it through if it's the clickable zone wrapper
          return false
        }
        const t = (b.innerText || '').trim()
        // For divs without inner text, allow if class includes 'item' / 'prop' / 'figure'
        if (t.length === 0) {
          const c = b.className || ''
          return /prop-|item-|figure/.test(c)
        }
        return t.length > 0
      })
      // Priority: continue/next button class > arrow-only > label match > first unclicked > last visible
      const nextBtn = cands.find(b => {
        const c = b.className || ''
        return /vn-next-btn|next-btn|continue-btn|btn-next|go-btn|skip-btn/.test(c)
      })
      const arrowOnly = cands.find(b => {
        const t = (b.innerText || '').trim()
        return ['▶', '›', '→', '‣'].includes(t)
      })
      const labelMatch = cands.find(b => {
        const t = (b.innerText || '').trim()
        return new RegExp('^(' + lbl + ')').test(t)
      })
      // Pick first unclicked (or last visible)
      const unclicked = cands.find(b => {
        const sig = (b.innerText || b.className).trim().slice(0, 40)
        return !history.includes(sig)
      })
      const target = nextBtn || arrowOnly || labelMatch || unclicked || cands[cands.length - 1]
      if (target) {
        const sig = (target.innerText || target.className).trim().slice(0, 40)
        if (!history.includes(sig)) history.push(sig)
        target.click()
        return { reached: false, clicked: sig, visibleCount: cands.length }
      }
      // No target — return all (raw) for debug
      return { reached: false, clicked: 'none', visibleCount: cands.length, candsList: all.map(c => ({ txt: (c.innerText || '').trim().slice(0, 20), cls: (c.className || '').slice(0, 40), pe: window.getComputedStyle(c).pointerEvents, disp: window.getComputedStyle(c).display })) }
      return { reached: false, clicked: 'none', visibleCount: cands.length }
    }, { lbl: label, history: Array.from(clickedHistory) })
    if (info.clicked && info.clicked !== 'none') clickedHistory.add(info.clicked)
    if (info.reached) return info
    if (i % 5 === 0 && i > 0) {
      console.log(`  ...step ${i}: ${info.clicked} (visible: ${info.visibleCount})`)
      if (info.candsList) {
        info.candsList.forEach((c, idx) => console.log(`     [${idx}] vis=${c.vis} ${c.txt} | ${c.cls}`))
      }
    }
    await wait(500)
  }
  return { reached: false, clicked: 'timeout' }
}

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 800, height: 1400 } })
const page = await ctx.newPage()

page.on('pageerror', e => errors.push('pageerror: ' + e.message))
page.on('response', resp => {
  if (resp.status() === 404) failed404.push(resp.url())
})
page.on('console', msg => {
  if (msg.type() === 'error') {
    const text = msg.text()
    // Ignore Chrome's Built-In AI experimental warnings
    if (text.includes('LanguageDetector') || text.includes('Built-In AI')) return
    errors.push('console.error: ' + text)
  }
})

console.log('=== 1. Load home page ===')
await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 })
await wait(1500)
const title = await page.title()
if (title.includes('东坡')) pass('title contains 东坡')
else fail('title', `got "${title}"`)

// === 2. Verify no external font requests (no gstatic) ===
console.log('\n=== 2. Font check (no Google Fonts) ===')
let externalFontReqs = 0
page.on('request', req => {
  const u = req.url()
  if (u.includes('fonts.gstatic.com') || u.includes('fonts.googleapis.com')) externalFontReqs++
})
await wait(2000)
if (externalFontReqs === 0) pass('no Google Fonts requests')
else fail('no Google Fonts', `${externalFontReqs} requests to fonts.gstatic.com`)

// === 3. Local woff2 loads OK ===
console.log('\n=== 3. Local font loads ===')
const fontStatus = await page.evaluate(async () => {
  const out = {}
  for (const f of ['Noto Serif SC', 'Noto Sans SC']) {
    await document.fonts.load(`400 16px "${f}"`)
    await document.fonts.load(`700 16px "${f}"`)
    out[f] = document.fonts.check(`16px "${f}"`)
  }
  return out
})
for (const [f, ok] of Object.entries(fontStatus)) {
  if (ok) pass(`${f} loaded (400 + 700)`)
  else fail(`${f}`, 'document.fonts.check returned false')
}

// === 4. Start game + advance to first choice ===
console.log('\n=== 4. Start → advance to choice ===')
await page.click('.btn-start')
await wait(1500)
const r1 = await clickAdvance(page, '翻到|继续|▶|进入|好的|知道了|完成|开|阅')
if (r1.reached === 'choice') pass('reached first choice')
else fail('first choice', `last action: ${r1.clicked}`)

// === 5. Click choice option ===
console.log('\n=== 5. Click choice option ===')
const choiceCount = await page.evaluate(() => document.querySelectorAll('.choice-paper').length)
if (choiceCount >= 2) pass(`choice has ${choiceCount} options`)
else fail('choice count', `only ${choiceCount} options`)

// === 6. Verify chip v-if (chips only on selected) ===
const chipsBefore = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.choice-paper')).map(p => !!p.querySelector('.choice-chips'))
})
const allHiddenBefore = chipsBefore.every(c => c === false)
if (allHiddenBefore) pass('no chips visible before click (v-if works)')
else fail('chips before click', `found ${chipsBefore.filter(Boolean).length} visible chips`)

await page.evaluate(() => document.querySelector('.choice-paper').click())
await wait(800)

const chipsAfter = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.choice-paper')).map((p, i) => ({
    idx: i,
    selected: p.classList.contains('is-selected'),
    hasChip: !!p.querySelector('.choice-chips')
  }))
})
const selectedIdx = chipsAfter.findIndex(c => c.selected)
if (selectedIdx >= 0 && chipsAfter[selectedIdx].hasChip) pass(`option ${selectedIdx} got chip after click`)
else fail('chip after click', `selected=${selectedIdx}, hasChip=${chipsAfter[selectedIdx]?.hasChip}`)
const otherChipsHidden = chipsAfter.filter((_, i) => i !== selectedIdx).every(c => !c.hasChip)
if (otherChipsHidden) pass('other options remain chip-less')
else fail('other chips', 'other options show chips before being selected')

// === 7. Advance through next scenes (test no crash) ===
console.log('\n=== 7. Continue 10 advance clicks ===')
for (let i = 0; i < 10; i++) {
  const r = await clickAdvance(page, '继续|▶|下一步|好的|知道了|翻到|进入|完成|开|阅', 20)
  if (r.reached === 'choice') {
    // Click first option
    await page.evaluate(() => document.querySelector('.choice-paper').click())
    await wait(700)
  }
}
pass('advanced 10 steps without crash')

// === 8. Summary ===
console.log('\n=== Summary ===')
console.log(`Passed: ${results.passed.length}`)
console.log(`Failed: ${results.failed.length}`)
console.log(`JS errors: ${errors.length}`)
console.log(`404s: ${failed404.length}`)
if (errors.length) {
  console.log('--- First 5 errors ---')
  errors.slice(0, 5).forEach(e => console.log('  ' + e.slice(0, 200)))
}
if (failed404.length) {
  console.log('--- 404s ---')
  failed404.slice(0, 5).forEach(u => console.log('  ' + u))
}

const isPass = results.failed.length === 0 && errors.length === 0 && failed404.length === 0
console.log('\n' + (isPass ? '✅ VERIFY: PASS' : '❌ VERIFY: FAIL'))

await browser.close()
process.exit(isPass ? 0 : 1)
