<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="这封来自子由的信，要怎么接？"
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
    text: "接受救援，活下来后学会更谨慎地处理表达边界",
    group: "ziyou",
    value: "accepted_reflective",
    variables: { qingfeng: 5, fenggu: 10, qinyou: 15, mingsheng: -5 },
    feedback: "你接住了这封信。也接住了亲人替你扛下的一部分重量。风骨不是从此闭嘴。而是知道，真话也需要承担。"
  },
  {
    id: "B",
    text: "接受救援，但仍然觉得自己无需反思",
    group: "ziyou",
    value: "accepted_no_reflection",
    variables: { fenggu: 5, qinyou: 30, mingsheng: 10 },
    feedback: "危机暂时过去了。但账本没有变轻。一个人的锋芒，如果总由亲人替他收场，终会变成亏欠。"
  },
  {
    id: "C",
    text: "不愿连累子由，坚持自己承担到底",
    group: "ziyou",
    value: "refused",
    variables: { fenggu: 20, qinyou: -5, yanhuo: -5 },
    feedback: "你想独自承担。这样很硬，也很孤。可风暴不是一个人的事，亲人未必会因为你拒绝就真的置身事外。"
  },
  {
    id: "D",
    text: "想靠关系摆平一切",
    group: "ziyou",
    value: "relation_fix",
    variables: { qingfeng: -20, qinyou: 10, mingsheng: 10 },
    feedback: "你试图用关系对抗风暴。可如果一场危机只能靠另一张关系网解开，这本账就更乱了。"
  }
]

function handleConfirm(choice) {
  addLogEntry({ type: 'choice', sceneId: 'S24', content: `选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S24', content: choice.feedback })
  applyChoice(choice, 'S24')
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S24', content: '剧情继续，前往 S25' })
  setScene('S25')
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
