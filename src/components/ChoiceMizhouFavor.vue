<template>
  <div class="choice-vn-wrap">
    <!-- 章节标记 -->
    <div class="chapter-mark">第三幕 · 密州 · 赈灾人情</div>

    <!-- 压力提示 -->
    <div class="pressure-hint">
      <p>旧识登门，手里提着礼物，眼里看着名额。门外的灾民还在等。粮仓的门锁，在黄昏里发出轻轻一声响。</p>
    </div>

    <ChoiceOverlay
      :visible="true"
      question="地方旧识请求你把捕蝗赏米、赈灾工役名额优先分给自己人。你怎么处理？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />

    <!-- 史实卡/改编卡 -->
    <div v-if="showFactCard" class="fact-overlay" @click="showFactCard = false">
      <FactAdaptationBook
        :fact="factCard.content"
        :adaptation="adaptationCard.content"
        @close="showFactCard = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { setScene, applyChoice, addLogEntry, setDirtyFlag, gameState } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'
import FactAdaptationBook from './FactAdaptationBook.vue'

const openChapterTransition = inject('openChapterTransition', null)
const showFactCard = ref(false)

const factCard = {
  title: '史实：密州赈灾与苏轼的民间立场',
  content: '苏轼在密州任职期间重视赈灾济民，反对在新法推行中加重百姓负担。其《上韩丞相论灾伤书》等文书记载了他对密州灾情的关注和对百姓生活的担忧。密州时期是苏轼从京城清谈走向地方实干的重要阶段。'
}

const adaptationCard = {
  title: '关于赈灾人情请托的改编说明',
  content: '本题为游戏化情境选择题，用于呈现地方官员面对人情请托时的公私边界挑战。注意：污染选项（熟人优先、借公做人情等）是游戏机制，用来表现公款使用和人情交换的边界风险，不代表苏轼真实行为。'
}

const choices = [
  {
    id: 'A',
    text: '核查情况，按公开标准分配',
    group: 'governance',
    value: 'governance_public_standard',
    variables: { qingfeng: 15, minsheng: 10 },
    feedback: '你把标准亮出来，按户按需分配。旧识的面子没有胜过账本上的规矩。清风账又清了一笔。'
  },
  {
    id: 'B',
    text: '熟人优先，资源倾斜',
    group: 'governance',
    value: 'governance_relation_priority',
    variables: { qingfeng: -15, minsheng: -5, mingsheng: 5, qinyou: 10 },
    feedback: '熟人拿到了名额。可账本上，这笔不知道该记公账还是私情。清风账又模糊了一截。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  },
  {
    id: 'C',
    text: '一律拒绝，不做解释',
    group: 'governance',
    value: 'governance_strict_isolation',
    variables: { qingfeng: 5, minsheng: -10, mingsheng: -5, qinyou: -5 },
    feedback: '你守住了规矩，也关上了一扇门。清风账安全了，可人间温度也降了一些。'
  },
  {
    id: 'D',
    text: '借赈灾资源做人情',
    group: 'governance',
    value: 'governance_public_misuse',
    variables: { qingfeng: -25, minsheng: -10, mingsheng: 10 },
    feedback: '公家的米，换了私人的情。这笔账一旦记下，清风账就彻底脏了。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。',
    dirty: true
  }
]

function handleConfirm(choice) {
  const feedback = choice.dirtyFeedback || choice.feedback
  addLogEntry({ type: 'choice', sceneId: 'S29', content: `【密州·赈灾人情】选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S29', content: feedback })
  if (choice.warning) {
    addLogEntry({ type: 'system', sceneId: 'S29', content: `清风账污染警告：${choice.warning}` })
    addLogEntry({ type: 'system', sceneId: 'S29', content: '【密州·清风账】清风账污染：账页边角出现浊痕。account_dirty = true' })
  }
  applyChoice(choice, 'S29')
  if (choice.dirty) {
    setDirtyFlag()
    addLogEntry({ type: 'system', sceneId: 'S29', content: '糊涂账标记已激活：account_dirty = true' })
  }
  // Log current variables after this choice
  const v = gameState.variables
  addLogEntry({ type: 'system', sceneId: 'S29', content: `当前清风账：${v.qingfeng}，民生账：${v.minsheng}，名声账：${v.mingsheng}` })
  showFactCard.value = true
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S29', content: '密州三选择完成，触发章节转场：第三幕→第四幕（乌台风暴）' })
  // Trigger chapter transition from 密州 to 乌台
  if (openChapterTransition) {
    openChapterTransition('mizhou', 'wutai', 'S30')
  } else {
    setScene('S30')
  }
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

.fact-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: all;
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
