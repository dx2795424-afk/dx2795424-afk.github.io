<template>
  <div class="choice-vn-wrap">
    <div class="pressure-hint">肉是热的，人情也是热的。热到哪里为止，要写进账里。</div>
    <ChoiceOverlay
      :visible="true"
      question="面对村民送来的一块肉，你怎么处理？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry, setDirtyFlag } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "确认没有请托和交换后收下，并回赠力所能及的小物",
    group: "meat",
    value: "clean_human_touch",
    variables: { qingfeng: 15, minsheng: 10, yanhuo: 10 },
    feedback: "你没有把所有人情都拒之门外，也没有让人情变成交易。清廉不是冷冰冰地隔绝人，而是把边界看清楚。"
  },
  {
    id: "B",
    text: "收下，并暗示以后可以常送",
    group: "meat",
    value: "human_debt",
    variables: { qingfeng: -20, yanhuo: 5, mingsheng: 5 },
    feedback: "肉还没下锅，账已经有味了。人情一旦被暗示成长期供给，就会从温暖变成风险。"
  },
  {
    id: "C",
    text: "一概拒绝，从此不和百姓来往",
    group: "meat",
    value: "isolated",
    variables: { qingfeng: 5, minsheng: -10, yanhuo: -5 },
    feedback: "你守住了安全，却也关上了一扇门。清廉不是拒绝所有关系，百姓也不是风险本身。"
  },
  {
    id: "D",
    text: "把它记到公账里，包装成公务接待",
    group: "meat",
    value: "confused_account",
    variables: { qingfeng: -30, minsheng: -5, yanhuo: 5 },
    feedback: "这笔账不能这样记。私人生活、公务支出、百姓人情，一旦混在一起，清风账就糊了。",
    warning: "注意：此为游戏化风险选项，不代表苏轼真实行为。"
  }
]

function handleConfirm(choice) {
  // 清风账批注风格日志
  if (choice.value === 'clean_human_touch') {
    addLogEntry({ type: 'account', sceneId: 'S32', content: '【黄州·人情】肉是热的，人情也是热的。你把边界写进了账里。', meta: { '清风 +15': true, '民生 +10': true, '烟火 +10': true } })
  } else if (choice.value === 'human_debt') {
    addLogEntry({ type: 'account', sceneId: 'S32', content: '【黄州·人情】人情被暗示成长期供给，从温暖变成了风险。', meta: { '清风 -20': true } })
  } else if (choice.value === 'isolated') {
    addLogEntry({ type: 'account', sceneId: 'S32', content: '【黄州·人情】你守住了安全，也关上了一扇门。', meta: { '清风 +5': true, '民生 -10': true } })
  } else if (choice.value === 'confused_account') {
    addLogEntry({ type: 'account', sceneId: 'S32', content: '【黄州·清风账】清风账污染：私人生活与公务支出混在一起。', meta: { 'account_dirty = true': true } })
  }
  addLogEntry({ type: 'feedback', sceneId: 'S32', content: choice.feedback })
  applyChoice(choice, 'S32')
  if (choice.id === 'D') {
    setDirtyFlag()
    addLogEntry({ type: 'system', sceneId: 'S32', content: '糊涂账标记已激活：account_dirty = true' })
  }
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S36', content: '剧情继续，前往 S37' })
  setScene('S37')
}
</script>

<style scoped>
.choice-vn-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.pressure-hint {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  max-width: 90%;
  text-align: center;
  padding: 8px 16px;
  background: rgba(20, 18, 14, 0.85);
  border: 1px solid rgba(184, 149, 108, 0.25);
  border-radius: 8px;
  font-family: var(--font-serif);
  font-size: 0.95rem;            /* V1.1 字号规范：0.8→0.95rem (15.2px) */
  color: rgba(200, 190, 170, 0.7);
  font-style: italic;
  backdrop-filter: blur(4px);
}
</style>
