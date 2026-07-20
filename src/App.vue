<template>
  <div id="app-container">
    <!-- 全局背景层 -->
    <BackgroundScene :theme="currentAtmosphere" />

    <!-- 全局账目Ribbon -->
    <AccountRibbon v-if="gameState.gameStarted" />

    <!-- 全局对话日志 -->
    <DialogueLog v-if="gameState.gameStarted" ref="dialogueLogRef" />

    <!-- 场景切换 -->
      <!-- HomeScreen: shown when game hasn't started, or when on S01 -->
      <HomeScreen
        v-if="shouldShowHome"
        key="home-screen"
      />
      <!-- All other scenes -->
      <component
        v-else
        :is="currentSceneComponent"
        :key="gameState.currentScene"
        :data-scene="gameState.currentScene"
      />

    <AudioToggle v-if="gameState.gameStarted" />

    <!-- 清风档案墙 (chapter select / log / retrospective) -->
    <LayeredArchiveWall
      :visible="gameState.showArchiveWall"
      :mode="gameState.archiveWallMode"
      :initial-chapter="gameState.archiveWallChapter"
      :narrate-text="gameState.archiveWallNarrate"
      :log-stats="logStats"
      :on-select="handleArchiveWallSelect"
      :on-close="handleArchiveWallClose"
      :on-back="handleArchiveWallBack"
    />

    <!-- 章节转场 -->
    <ChapterTransitionWall
      :visible="gameState.showChapterTransition"
      :from-chapter="gameState.transitionFrom"
      :from-title="transitionFromTitle"
      :from-subtitle="transitionFromSubtitle"
      :to-chapter="gameState.transitionTo"
      :to-title="transitionToTitle"
      :to-subtitle="transitionToSubtitle"
      :on-continue="handleTransitionContinue"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, provide, watch } from 'vue'
import { gameState } from './store/gameState.js'
import {
  showArchiveWall,
  hideArchiveWall,
  showChapterTransition,
  hideChapterTransition,
  closeAllOverlays,
  setScene
} from './store/gameState.js'
import BackgroundScene from './components/BackgroundScene.vue'
import HomeScreen from './components/HomeScreen.vue'
import AccountRibbon from './components/AccountRibbon.vue'
import AudioToggle from './components/AudioToggle.vue'
import DialogueLog from './components/DialogueLog.vue'
import LayeredArchiveWall from './components/LayeredArchiveWall.vue'
import ChapterTransitionWall from './components/ChapterTransitionWall.vue'
import { useSceneAudio } from './composables/useSceneAudio.js'

const dialogueLogRef = ref(null)

// Provide log ref to all child scenes
provide('dialogueLogRef', dialogueLogRef)

// Scene atmosphere mapping
const atmosphereMap = {
  S00: 'home',
  S01: 'home',
  S02: 'intro',
  S10: 'meishan',
  S11: 'meishan',
  S12: 'meishan',
  S20: 'capital',
  S21: 'capital',
  S22: 'wutai',
  S23: 'wutai',
  S24: 'wutai',
  S25: 'huangzhou',
  S26: 'mizhou',
  S27: 'mizhou',
  S28: 'mizhou',
  S29: 'mizhou',
  S30: 'wutai',
  S34: 'huangzhou',
  S35: 'huangzhou',
  S36: 'huangzhou',
  S37: 'huangzhou',
  S38: 'huangzhou',
  S39: 'chengtian',
  S40: 'chengtian',
  S41: 'chengtian',
  S42: 'chengtian',
  S43: 'result',
  S44: 'hangzhou',
  S45: 'hangzhou',
  S46: 'hangzhou',
  S47: 'hangzhou',
  S50: 'danzhou',
  S51: 'danzhou',
  S52: 'danzhou',
  S53: 'danzhou',
  S54: 'danzhou',
  S60: 'result',
  S61: 'result',
  S62: 'home'
}

const currentAtmosphere = computed(() => atmosphereMap[gameState.currentScene] || 'home')

useSceneAudio(gameState, currentAtmosphere)

// Scene component mapping
const sceneComponents = {
  S00: defineAsyncComponent(() => import('./components/StartScreen.vue')),
  // S01 is rendered explicitly via <HomeScreen v-if="shouldShowHome">, not here
  S02: defineAsyncComponent(() => import('./components/IntroScreen.vue')),
  S10: defineAsyncComponent(() => import('./components/SceneMeishanNight.vue')),
  S11: defineAsyncComponent(() => import('./components/SceneDeskThreeItems.vue')),
  S12: defineAsyncComponent(() => import('./components/SceneBrothers.vue')),
  S20: defineAsyncComponent(() => import('./components/SceneCapital.vue')),
  S21: defineAsyncComponent(() => import('./components/ChoiceExpression.vue')),
  S22: defineAsyncComponent(() => import('./components/SceneStorm.vue')),
  S23: defineAsyncComponent(() => import('./components/SceneWutai.vue')),
  S24: defineAsyncComponent(() => import('./components/ChoiceRescue.vue')),
  S25: defineAsyncComponent(() => import('./components/SceneAfterStorm.vue')),
  S26: defineAsyncComponent(() => import('./components/SceneMizhouIntro.vue')),
  S27: defineAsyncComponent(() => import('./components/ChoiceMizhouRelief.vue')),
  S28: defineAsyncComponent(() => import('./components/ChoiceMizhouGrain.vue')),
  S29: defineAsyncComponent(() => import('./components/ChoiceMizhouFavor.vue')),
  S30: defineAsyncComponent(() => import('./components/SceneWutaiBridge.vue')),
  S34: defineAsyncComponent(() => import('./components/SceneHuangzhou.vue')),
  S35: defineAsyncComponent(() => import('./components/BudgetGame.vue')),
  S36: defineAsyncComponent(() => import('./components/ChoiceMeat.vue')),
  S37: defineAsyncComponent(() => import('./components/ChoiceCook.vue')),
  S38: defineAsyncComponent(() => import('./components/SceneDongpo.vue')),
  S39: defineAsyncComponent(() => import('./components/SceneMoonlight.vue')),
  S40: defineAsyncComponent(() => import('./components/SceneExplore.vue')),
  S41: defineAsyncComponent(() => import('./components/ChoiceHuaiMin.vue')),
  S42: defineAsyncComponent(() => import('./components/SceneMoonComment.vue')),
  S43: defineAsyncComponent(() => import('./components/ResultReport.vue')),
  S44: defineAsyncComponent(() => import('./components/SceneHangzhouReturn.vue')),
  S45: defineAsyncComponent(() => import('./components/ChoiceWestLakeProject.vue')),
  S46: defineAsyncComponent(() => import('./components/ChoiceHangzhouAccount.vue')),
  S47: defineAsyncComponent(() => import('./components/SceneHangzhouSummary.vue')),
  S50: defineAsyncComponent(() => import('./components/SceneDanzhouIntro.vue')),
  S51: defineAsyncComponent(() => import('./components/ChoiceDanzhouTeach.vue')),
  S52: defineAsyncComponent(() => import('./components/ChoiceDanzhouLife.vue')),
  S53: defineAsyncComponent(() => import('./components/ChoiceTangzuo.vue')),
  S54: defineAsyncComponent(() => import('./components/SceneDanzhouSummary.vue')),
  S60: defineAsyncComponent(() => import('./components/ResultReport.vue')),
  S61: defineAsyncComponent(() => import('./components/SharePoster.vue')),
  S62: defineAsyncComponent(() => import('./components/CreditsScreen.vue'))
}

const currentSceneComponent = computed(() => {
  const component = sceneComponents[gameState.currentScene]
  return component || null
})

// HomeScreen shows when: game not started OR on S01 (home screen scene)
// Also fallback to home if currentScene has no valid component
const shouldShowHome = computed(() => {
  return !gameState.gameStarted || gameState.currentScene === 'S01' || !currentSceneComponent.value
})

// ─── Chapter info for transitions ─────────────────────────────────────────────
const chapterInfo = {
  meishan:   { title: '眉山少年', subtitle: '家学、少年与成长' },
  capital:    { title: '京城成名', subtitle: '才名、风波与京城' },
  mizhou:     { title: '密州治理', subtitle: '蝗灾、旱情与民生账' },
  wutai:      { title: '乌台风暴', subtitle: '文字狱与子由救援' },
  huangzhou:  { title: '黄州坠落', subtitle: '小灶、烟火与账本' },
  chengtian:  { title: '承天夜游', subtitle: '月色、怀民与自省' },
  hangzhou:   { title: '再入杭州', subtitle: '清风试炼与西湖治理' },
  danzhou:    { title: '儋州天涯', subtitle: '余火传灯与晚年选择' },
  result:     { title: '清风结卷', subtitle: '东坡一生，一本清账' },
}

const transitionFromTitle = computed(() => chapterInfo[gameState.transitionFrom]?.title || '')
const transitionFromSubtitle = computed(() => chapterInfo[gameState.transitionFrom]?.subtitle || '')
const transitionToTitle = computed(() => chapterInfo[gameState.transitionTo]?.title || '')
const transitionToSubtitle = computed(() => chapterInfo[gameState.transitionTo]?.subtitle || '')

// ─── Log stats for archive wall ───────────────────────────────────────────────
const logStats = computed(() => ({
  entries: gameState.dialogueLog.length,
  chapters: new Set(gameState.choiceHistory.map(h => {
    if (h.sceneId === 'S21') return 'capital'
    if (h.sceneId === 'S24') return 'wutai'
    if (h.sceneId === 'S32' || h.sceneId === 'S33') return 'huangzhou'
    if (h.sceneId === 'S42') return 'chengtian'
    return 'meishan'
  })).size,
  choices: gameState.choiceHistory.length,
}))

// ─── Archive Wall handlers ────────────────────────────────────────────────────
function handleArchiveWallSelect(targetScene, chapter) {
  hideArchiveWall()
  gameState.currentChapter = chapter
  if (chapter === 'meishan') {
    setScene('S10') // Skip S02 intro, go direct to first chapter
  } else if (chapter === 'capital') {
    setScene('S20')
  } else if (chapter === 'mizhou') {
    setScene('S26')
  } else if (chapter === 'wutai') {
    setScene('S23')
  } else if (chapter === 'huangzhou') {
    setScene('S34')
  } else if (chapter === 'chengtian') {
    setScene('S39')
  } else if (chapter === 'result') {
    setScene('S43')
  }
}

function handleArchiveWallClose() {
  hideArchiveWall()
}

function handleArchiveWallBack() {
  hideArchiveWall()
  setScene('S01') // Return to home
}

// ─── Chapter Transition handlers ─────────────────────────────────────────────
function handleTransitionContinue() {
  const targetScene = gameState.transitionTargetScene
  const to = gameState.transitionTo
  hideChapterTransition()
  gameState.transitionTargetScene = ''
  if (targetScene) {
    setScene(targetScene)
    return
  }
  // Navigate to the next scene based on transition target
  if (to === 'capital') {
    setScene('S20')
  } else if (to === 'mizhou') {
    setScene('S26')
  } else if (to === 'wutai') {
    setScene('S23')
  } else if (to === 'huangzhou') {
    setScene('S34')
  } else if (to === 'chengtian') {
    setScene('S39')
  } else if (to === 'hangzhou') {
    setScene('S44')
  } else if (to === 'danzhou') {
    setScene('S50')
  } else if (to === 'result') {
    setScene('S60')
  }
}

// Public API: expose archive wall open functions to child components via inject
// Provide the FUNCTION (not the ref) so child components can call it directly
provide('openArchiveWall', (opts) => showArchiveWall(opts))
provide('openChapterTransition', (from, to, targetScene = '') => showChapterTransition(from, to, targetScene))
provide('hideArchiveWall', hideArchiveWall)
provide('hideChapterTransition', hideChapterTransition)

// ─── Overlay Cleanup ─────────────────────────────────────────────────────────────
// When currentScene changes: close all overlays unconditionally.
// This prevents archive wall / dialogue log / FAB from persisting into gameplay.
watch(() => gameState.currentScene, (newScene) => {
  closeAllOverlays()
  // Ensure gameStarted is true for any non-home scene
  if (newScene !== 'S01' && newScene !== 'S00') {
    gameState.gameStarted = true
  }
})

// ─── Mount: Reset session state ─────────────────────────────────────────────────
onMounted(() => {
  // Defensive: if currentScene is invalid, fall back to S01
  const validSceneIds = Object.keys(sceneComponents)
  if (!gameState.currentScene || !validSceneIds.includes(gameState.currentScene)) {
    gameState.currentScene = 'S01'
    gameState.gameStarted = false
  }

  // Close all overlays on every page load — prevents state from previous sessions leaking
  closeAllOverlays()

  // DEV-only debug functions: never expose these in production
  if (import.meta.env.DEV) {
    window.setScene = setScene
    window.__jumpToScene = (sceneId) => {
      gameState.currentScene = sceneId
      gameState.gameStarted = true
      closeAllOverlays()
      // Persist so reload doesn't restore old scene
      try {
        const STORAGE_KEY = 'dongpo_qingfengji_save'
        const snap = {}
        for (const k in gameState) {
          const v = gameState[k]
          if (typeof v !== 'function' && typeof v !== 'symbol') {
            try { snap[k] = JSON.parse(JSON.stringify(v)) } catch(e) {}
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snap))
      } catch(e) {}
      console.log('JumpToScene:', sceneId)
    }
    window.__forceGameStarted = () => { gameState.gameStarted = true }
    window.__closeLogOverlay = () => { gameState.showDialogueLog = false }
    window.__closeArchiveWall = () => { hideArchiveWall() }
  }
})
</script>

<style>
@import './styles/theme.css';
@import './styles/mobile.css';
@import './styles/animations.css';
@import './styles/responsive.css';

/* Scene transitions */
.scene-enter-active,
.scene-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.scene-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.scene-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

#app-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* === V0.3 全局新角色立绘（船夫/渔翁/山僧/太守/惠州父老/儋州书生）===
   各 Scene 模板只需加一行 <img class="dp-character dp-character--boatman" :src="..." />
   即可在右下角显示对应角色立绘，pointer-events: none 不挡剧情点击 */
.dp-character {
  position: fixed;
  bottom: 24px;
  right: 24px;
  max-height: 48vh;
  max-width: 28vw;
  object-fit: contain;
  image-rendering: auto;
  pointer-events: none;
  z-index: 30;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  filter: drop-shadow(0 4px 14px rgba(0,0,0,0.45));
}
.dp-character.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.dp-character--left {
  right: auto;
  left: 24px;
}
/* 移动端缩小 */
@media (max-width: 700px) {
  .dp-character {
    max-height: 30vh;
    max-width: 36vw;
    bottom: 80px;
  }
}
</style>
