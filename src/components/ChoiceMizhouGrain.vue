<template>
  <div class="choice-vn-wrap">
    <!-- 章节标记 -->
    <div class="chapter-mark">第三幕 · 密州 · 青苗钱与税负</div>

    <!-- 压力提示 -->
    <div class="pressure-hint">
      <p>奏折上的每一个字，都可能让某个人今晚没有饭吃。账本里的每一笔，都可能压在明年的青苗上。</p>
    </div>

    <ChoiceOverlay
      :visible="true"
      question="青苗钱和税负压在灾民身上。你要怎么处理？"
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
import { ref } from 'vue'
import { setScene, applyChoice, addLogEntry } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'
import FactAdaptationBook from './FactAdaptationBook.vue'

const showFactCard = ref(false)

const factCard = {
  title: '史实：青苗钱与密州税负',
  content: '青苗钱是宋代王安石变法中的重要政策，在地方实施时给灾民带来额外负担。苏轼在密州时期对青苗钱等新法持批评态度，认为其加重了百姓负担。熙宁七年密州确有旱灾，苏轼上书反映灾情。'
}

const adaptationCard = {
  title: '关于青苗钱选择的改编说明',
  content: '本题为游戏化情境选择题。选项呈现的是地方官员在执行政策时面临的真实张力：如实上报可能触怒朝廷，隐瞒灾情对不起百姓，游戏化选项用于呈现这些边界情况，不代表苏轼真实做过借名扩声等行为。'
}

const choices = [
  {
    id: 'A',
    text: '如实上报灾情，为百姓请求减免',
    group: 'governance',
    value: 'governance_justice_speak',
    variables: { qingfeng: 15, minsheng: 20, mingsheng: -10, fenggu: 20 },
    feedback: '你把实情写进了奏折。朝廷批不批是另一回事，但这一笔，清风账记得清楚。风骨账亮了。'
  },
  {
    id: 'B',
    text: '按政策执行，但尽量减轻百姓负担',
    group: 'governance',
    value: 'governance_soft_execute',
    variables: { qingfeng: 5, minsheng: 5, fenggu: -5 },
    feedback: '你没有顶风，也没有顺风滑。在夹缝里尽量找了一个让百姓喘口气的空间。'
  },
  {
    id: 'C',
    text: '完全照章执行，先保自己的政绩',
    group: 'governance',
    value: 'governance_full_execute',
    variables: { qingfeng: -5, minsheng: -10, mingsheng: 20 },
    feedback: '账面上，你的政绩很好看。清风账上，你的名声开始和百姓的生活拉开了距离。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  },
  {
    id: 'D',
    text: '借为民请命之名扩大个人声望',
    group: 'governance',
    value: 'governance_fame_opportunism',
    variables: { qingfeng: -10, minsheng: 5, mingsheng: 25 },
    feedback: '民请命是真的，扩名声也是真的。清风账开始糊涂。名声账的风险在累积。',
    dirtyFeedback: '那一笔写得很轻，墨却晕得很深。清风账上，第一次出现了擦不掉的浊痕。',
    warning: '注意：此为游戏化风险选项，不代表苏轼真实行为。'
  }
]

function handleConfirm(choice) {
  const feedback = choice.dirtyFeedback || choice.feedback
  addLogEntry({ type: 'choice', sceneId: 'S28', content: `【密州·青苗钱】选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S28', content: feedback })
  if (choice.warning) {
    addLogEntry({ type: 'system', sceneId: 'S28', content: `清风账污染警告：${choice.warning}` })
    addLogEntry({ type: 'system', sceneId: 'S28', content: '【密州·清风账】清风账污染：账页边角出现浊痕。account_dirty = true' })
  }
  applyChoice(choice, 'S28')
  showFactCard.value = true
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S28', content: '密州青苗钱选择完成，前往赈灾人情请托选择' })
  setScene('S29')
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
