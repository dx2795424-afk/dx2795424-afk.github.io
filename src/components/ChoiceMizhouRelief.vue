<template>
  <div class="choice-vn-wrap">
    <!-- 章节标记 -->
    <div class="chapter-mark">第三幕 · 密州 · 治蝗与赈灾</div>

    <!-- 压力提示 -->
    <div class="pressure-hint">
      <p>蝗虫飞过，遮天蔽日。门外人声越来越密。粮仓的锁扣，在风里轻轻响。</p>
    </div>

    <ChoiceOverlay
      :visible="true"
      question="蝗虫正在吞噬农田，粮仓有限，先救哪里？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />

    <!-- 史实卡/改编卡：FactAdaptationBook 自己 <Teleport to="body"> + 听 gameState.showFactBook -->
    <FactAdaptationBook
      :fact="factCard.content"
      :adaptation="adaptationCard.content"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry, gameState } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'
import FactAdaptationBook from './FactAdaptationBook.vue'

const factCard = {
  title: '史实：苏轼知密州与灾情',
  content: '苏轼于熙宁七年（1074）任密州太守。密州时期确实经历旱灾、蝗灾。苏轼在密州期间关注捕蝗、赈灾、税负等民生问题，有《答胡强仲书》等文字记录密州灾情与治理思路。'
}

const adaptationCard = {
  title: '关于密州选择的改编说明',
  content: '本题为游戏化情境，用于呈现地方治理中公私边界的真实复杂性。清风账污染选项为游戏化风险模拟，不代表苏轼真实做过资源倾斜、绕过程序等行为。'
}

const choices = [
  {
    id: 'A',
    text: '先集中资源捕蝗，保住粮食',
    group: 'governance',
    value: 'governance_people_first',
    variables: { qingfeng: 10, minsheng: 15 },
    feedback: '你让捕蝗队进村，也让粮仓优先发给最需要的百姓。清风账上，这一笔是清的。民生账有光。'
  },
  {
    id: 'B',
    text: '报上级请求支援，同时把报告写得好看',
    group: 'governance',
    value: 'governance_face_engineering',
    variables: { qingfeng: -10, minsheng: -5, mingsheng: 15 },
    feedback: '报告里的数字很漂亮。可蝗虫不读报告。清风账亏了一截。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  },
  {
    id: 'C',
    text: '把资源优先给认识的熟人',
    group: 'governance',
    value: 'governance_relation_favor',
    variables: { qingfeng: -20, minsheng: -10, mingsheng: 5 },
    feedback: '熟人先收到了粮。账本上，这笔不知道该记公还是记私。清风账已经脏了。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  },
  {
    id: 'D',
    text: '绕过正常程序，先快速灭火',
    group: 'governance',
    value: 'governance_bypass',
    variables: { qingfeng: -15, minsheng: 5, mingsheng: 10 },
    feedback: '火是灭了，可账没有走正常程序。清风账上，又多了一笔说不清的账。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  }
]

function handleConfirm(choice) {
  const feedback = choice.dirtyFeedback || choice.feedback
  addLogEntry({ type: 'choice', sceneId: 'S27', content: `【密州·治蝗】选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S27', content: feedback })
  if (choice.warning) {
    addLogEntry({ type: 'system', sceneId: 'S27', content: `清风账污染警告：${choice.warning}` })
    addLogEntry({ type: 'system', sceneId: 'S27', content: '【密州·清风账】清风账污染：账页边角出现浊痕。account_dirty = true' })
  }
  applyChoice(choice, 'S27')
  // Show fact card after choice (FactAdaptationBook 内部 Teleport + 听 gameState.showFactBook)
  gameState.showFactBook = true
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S27', content: '密州治蝗选择完成，前往青苗钱选择' })
  setScene('S28')
}
</script>

<style scoped>
.choice-vn-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(13, 13, 18, 0.8);
  border: 1px solid rgba(184, 149, 108, 0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 190, 170, 0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.pressure-hint {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  max-width: 300px;
  text-align: center;
  animation: pressure-fade 0.8s ease;
}

.pressure-hint p {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: rgba(180, 165, 130, 0.6);
  line-height: 1.7;
  font-style: italic;
}

@keyframes pressure-fade {
  from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
