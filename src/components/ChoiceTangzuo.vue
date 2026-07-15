<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="姜唐佐来问学。一位远道而来的学子，带着书信和文章。你已衰病，却仍看见他眼里的光。"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "认真批读，鼓励他把学问带回乡里",
    group: "tangzuo",
    value: "spark",
    variables: { fenggu: 15, minsheng: 15 },
    feedback: "余火传灯。这一刻，天涯不是尽头，是起点。",
    annotation: null
  },
  {
    id: "B",
    text: "只夸文章，不再深谈",
    group: "tangzuo",
    value: "polite",
    variables: { fenggu: 5, minsheng: -5 },
    feedback: "客气了，可学问没有真正传下去。光亮了一下，又暗了。",
    annotation: null
  },
  {
    id: "C",
    text: "因疲惫拒绝见他",
    group: "tangzuo",
    value: "missed",
    variables: { yanhuo: -10, minsheng: -10 },
    feedback: "错过了一个火种。这一页，记在账上。",
    annotation: null
  },
  {
    id: "D",
    text: "把他当成证明自己眼光的名声材料",
    group: "tangzuo",
    value: "fame_use",
    variables: { mingsheng: 15, qingfeng: -5 },
    feedback: "把学子变成道具，名声账又起波澜了。",
    annotation: "名声风险，不代表史实",
    warning: "⚠️ 此为虚构，不代表苏轼真实行为"
  }
]

function handleConfirm(choice) {
  addLogEntry({
    type: 'choice',
    sceneId: 'S53',
    content: `姜唐佐选择 ${choice.id}：${choice.text}`,
    meta: { variables: choice.variables, flag: choice.value }
  })
  addLogEntry({ type: 'feedback', sceneId: 'S53', content: choice.feedback })
  if (choice.annotation) {
    addLogEntry({ type: 'system', sceneId: 'S53', content: `[改编说明] ${choice.annotation}` })
  }
  applyChoice(choice, 'S53')
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S53', content: '进入儋州小结' })
  setScene('S54')
}
</script>

<style scoped>
.choice-vn-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
