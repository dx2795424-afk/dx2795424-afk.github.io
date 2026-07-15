// test-font-15px.mjs
// 验证 .vue 组件 .question-hint / .choice-text / .feedback-text / 段落正文 font-size >= 15px
// 解析 <style scoped>, 把目标类按 16px 根字号换算, 不通过列清单
import fs from 'node:fs/promises';
import path from 'node:path';

const COMPONENTS_DIR = 'D:/app/dongpo-qingfengji-h5/src/components';
const ROOT_FONT_PX = 16;
const MIN_BODY_PX  = 15;

function remToPx(rem) { return rem * ROOT_FONT_PX; }
function parsePx(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (t.endsWith('rem')) {
    const n = parseFloat(t);
    return Number.isFinite(n) ? remToPx(n) : null;
  }
  if (t.endsWith('px')) {
    const n = parseFloat(t);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// V1.1 目标类: 段落正文/题目提示/选项文字/反馈文字
// 也覆盖通过模板 p 标签包裹的段落文本
const TARGET_CLASS_RE =
  /^(question-hint|choice-text|feedback-text|scene-intro|narrative|narration|paragraph|story-text|intro-text|scene-text|content-text|body-text|description|scene-description|scene-content|info-text|message-text|letter-ps|letter-kicker|envelope-hint|envelope-text|choice-warning|log-empty|entry-content|point-text|popup-title|credits-intro|loading-title|ambient-text|loading-msg|empty-msg|placeholder-msg|tooltip-msg|hint-msg|poster-quote|poster-subtitle|poster-caption|poster-tagline)$/;

// 类名 + 子 p 选择器(段落正文)
const TARGET_DESCENDANT_RE = /\b(scene-intro|narrative|story-text|info-text|description|credits-intro|ambient-text|envelope-hint|popup|budget-feedback|empty-state)\b[\s>]*p\b/;

function parseStyleBlocks(styleText) {
  const blocks = [];
  const lines = styleText.split('\n');
  let buf = '';
  let depth = 0;
  let selector = '';
  let isInMedia = false;
  let mediaDepth = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (!buf) {
      if (line.startsWith('@media')) isInMedia = true;
      if (isInMedia) {
        buf += raw + '\n';
        if (line.includes('{')) mediaDepth++;
        if (line.includes('}')) {
          mediaDepth--;
          if (mediaDepth <= 0) { isInMedia = false; buf = ''; }
        }
        continue;
      }
      const m = line.match(/^([.#][A-Za-z0-9_\-:>\s,]+)\s*\{/);
      if (m) {
        selector = m[1].trim();
        buf = raw + '\n';
        depth = 1;
        continue;
      }
      if (line.includes('{') && !line.includes('}')) {
        buf = raw + '\n';
        depth = 1;
        continue;
      }
    } else {
      buf += raw + '\n';
      for (const c of raw) {
        if (c === '{') depth++;
        else if (c === '}') depth--;
      }
      if (depth <= 0) {
        blocks.push({ selector, text: buf });
        buf = '';
        selector = '';
        depth = 0;
      }
    }
  }
  return blocks;
}

function extractFontSize(blockText) {
  const m = blockText.match(/font-size\s*:\s*([^;}\n]+)/);
  if (!m) return null;
  return m[1].trim();
}

function isTarget(selector) {
  // 排除装饰 .chapter-mark / .pixel / .small-caption / .choice-letter 等
  if (/\.chapter-mark\b|\.pixel\b|\.small-caption\b|\.chapter-num\b|\.page-num\b/.test(selector)) return false;
  // 简单类
  const parts = selector.split(/[ ,>+~]/).map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    const cls = p.replace(/^[.#]/, '').replace(/:[a-z-]+$/, '');
    if (!cls) continue;
    // 单独类
    if (TARGET_CLASS_RE.test(cls)) return true;
    // 后代选择器 .foo p / .foo > p
    if (p.endsWith(' p') || p.endsWith('> p')) return true;
  }
  // 包含 .xxx p 这种结构
  if (TARGET_DESCENDANT_RE.test(selector)) return true;
  return false;
}

async function main() {
  const files = await fs.readdir(COMPONENTS_DIR);
  const vueFiles = files.filter(f => f.endsWith('.vue'));
  const violations = [];
  const ok = [];
  for (const f of vueFiles) {
    const full = path.join(COMPONENTS_DIR, f);
    const src = await fs.readFile(full, 'utf8');
    const styleMatches = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
    for (const sm of styleMatches) {
      const style = sm[1];
      const blocks = parseStyleBlocks(style);
      for (const blk of blocks) {
        if (!isTarget(blk.selector)) continue;
        const fontSize = extractFontSize(blk.text);
        if (!fontSize) continue;
        const px = parsePx(fontSize);
        if (px === null) continue;
        const entry = {
          file: f,
          selector: blk.selector,
          fontSize,
          px: Number(px.toFixed(2)),
          pass: px >= MIN_BODY_PX,
        };
        if (entry.pass) ok.push(entry);
        else violations.push(entry);
      }
    }
  }
  // 报告
  console.log(`\n=== V1.1 font-size >= ${MIN_BODY_PX}px 测试 ===\n`);
  console.log(`扫描: ${vueFiles.length} 文件`);
  console.log(`通过: ${ok.length}`);
  console.log(`失败: ${violations.length}\n`);
  if (violations.length > 0) {
    console.log('--- 不通过 ---');
    for (const v of violations) {
      console.log(`  ${v.file}: ${v.selector}  (${v.fontSize} = ${v.px}px)`);
    }
  }
  console.log('\n--- 通过明细 ---');
  for (const v of ok) {
    console.log(`  ✓ ${v.file}: ${v.selector}  (${v.fontSize} = ${v.px}px)`);
  }
  // 写 JSON
  const outJson = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), '..', 'workspace', 'test-font-15px.json');
  // simpler: 写当前目录
  await fs.writeFile('C:/Users/cd/.mavis/plans/plan_c85ac6b0/workspace/test-font-15px.json', JSON.stringify({ violations, ok, scannedFiles: vueFiles.length }, null, 2));
  console.log(`\n详细: C:/Users/cd/.mavis/plans/plan_c85ac6b0/workspace/test-font-15px.json`);
  process.exit(violations.length > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(2); });