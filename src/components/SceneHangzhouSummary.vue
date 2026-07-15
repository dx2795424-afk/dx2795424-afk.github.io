<template>
  <div class="scene-frame hangzhou-summary">
    <div class="chapter-mark">第六幕 · 再入杭州</div>

    <div class="summary-visual">
      <div class="wl-silhouette"></div>
    </div>

    <div class="scene-content">
      <div class="summary-title">杭州小结：水清，账也要清</div>

      <div class="summary-lines" :class="{ visible: showLines }">
        <!-- Dynamic based on flags -->
        <p v-if="accountDirty" class="summary-line warning">
          杭州账中已有浊痕。
        </p>
        <p v-if="peopleFirst && openAccount" class="summary-line good">
          西湖之水，先流向民生。
        </p>
        <p v-if="fameProject" class="summary-line caution">
          名声工程留下了印记。
        </p>
        <p v-if="relationContract || privateMargin" class="summary-line warning">
          人情进账，清风出账。
        </p>
        <p v-if="bypassProcess" class="summary-line caution">
          程序让位于效率，风险已记。
        </p>
        <p v-if="overcautious" class="summary-line caution">
          过度避嫌，民生账被搁置了。
        </p>

        <p v-if="!accountDirty && peopleFirst" class="summary-line good">
          杭州这一笔，账是清的。
        </p>
        <p v-else-if="!accountDirty" class="summary-line">
          杭州这一页，账未糊涂。
        </p>
      </div>
    </div>

    <button
      class="btn-next"
      :class="{ visible: showButton }"
      data-testid="btn-next-S47"
      @click="handleNext"
    >
      南下儋州
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { gameState, setScene, addLogEntry } from '../store/gameState.js'

const showLines = ref(false)
const showButton = ref(false)

const accountDirty = computed(() => gameState.flags.account_dirty === true)
const peopleFirst = computed(() => gameState.flags.hangzhou_people_first === 'people_first')
const openAccount = computed(() => gameState.flags.hangzhou_open_account === 'open_account')
const fameProject = computed(() => gameState.flags.hangzhou_fame_project === 'fame_project')
const relationContract = computed(() => gameState.flags.hangzhou_relation_contract === 'relation_contract')
const privateMargin = computed(() => gameState.flags.hangzhou_private_margin === 'private_margin')
const bypassProcess = computed(() => gameState.flags.hangzhou_bypass_process === 'bypass_process')
const overcautious = computed(() => gameState.flags.hangzhou_overcautious === 'overcautious')

onMounted(() => {
  addLogEntry({ type: 'scene', sceneId: 'S47', content: '【第六幕·杭州小结】' })
  addLogEntry({
    type: 'system',
    sceneId: 'S47',
    content: `杭州账目：account_dirty=${accountDirty.value}, people_first=${peopleFirst.value}, open_account=${openAccount.value}`
  })
  setTimeout(() => { showLines.value = true }, 800)
  setTimeout(() => { showButton.value = true }, 2000)
})

function handleNext() {
  addLogEntry({ type: 'system', sceneId: 'S47', content: '南下儋州，进入第七幕' })
  setScene('S50')
}
</script>

<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(10, 20, 18, 0.85);
  border: 1px solid rgba(80, 140, 120, 0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(160, 200, 180, 0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

.summary-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(160deg, #0a1814 0%, #0d2018 50%, #101a14 100%);
  overflow: hidden;
}

.wl-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(0deg, rgba(15, 30, 25, 0.9) 0%, transparent 100%);
}

.scene-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 32px;
  text-align: center;
  max-width: 600px;
}

.summary-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: rgba(160, 210, 185, 0.85);
  letter-spacing: 0.1em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.summary-lines.visible {
  opacity: 1;
  transform: translateY(0);
}

.summary-line {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: rgba(180, 210, 195, 0.7);
  line-height: 1.8;
  margin: 0;
}

.summary-line.good {
  color: rgba(140, 200, 160, 0.85);
}

.summary-line.warning {
  color: rgba(200, 160, 120, 0.8);
}

.summary-line.caution {
  color: rgba(180, 180, 160, 0.7);
}

.btn-next {
  position: relative;
  z-index: 10;
  margin-top: 40px;
  padding: 12px 36px;
  background: transparent;
  border: 1px solid rgba(80, 160, 120, 0.4);
  border-radius: 4px;
  color: rgba(160, 210, 185, 0.75);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease, background 0.3s ease, border-color 0.3s ease;
}

.btn-next.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn-next:hover {
  background: rgba(80, 160, 120, 0.1);
  border-color: rgba(80, 160, 120, 0.65);
  color: rgba(180, 230, 205, 0.9);
}
</style>
