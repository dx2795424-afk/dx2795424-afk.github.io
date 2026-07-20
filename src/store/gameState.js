import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dongpo_qingfengji_save'

// Load saved state or return default
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (import.meta.env.DEV) console.log('[DONGPO gameState] Loaded from localStorage. gameStarted=', parsed.gameStarted, 'currentScene=', parsed.currentScene)
      return parsed
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('Failed to load save:', e)
  }
  if (import.meta.env.DEV) console.log('[DONGPO gameState] No localStorage save, using defaults')
  return null
}

// Unified flags structure
const DEFAULT_FLAGS = {
  // Named choice flags (group + value pattern)
  expression: null,   // 'responsible' | 'safe_but_weak' | 'reckless' | 'fame_first'
  ziyou: null,        // 'accepted_reflective' | 'accepted_no_reflection' | 'refused' | 'relation_fix'
  meat: null,         // 'clean_human_touch' | 'human_debt' | 'isolated' | 'confused_account'
  cook: null,         // 'slow_stew' | 'face_spend' | 'public_misuse' | 'collapse'
  huai: null,         // 'moon_walk' | 'hot_words' | 'closed_self' | 'privilege_friend'
  governance: null,   // 'governance_people_first' | 'governance_face_engineering' | 'governance_relation_favor' | 'governance_bypass' | 'governance_justice_speak' | 'governance_soft_execute' | 'governance_full_execute' | 'governance_fame_opportunism' | 'governance_public_standard' | 'governance_relation_priority' | 'governance_strict_isolation' | 'governance_public_misuse'
  // 杭州
  hangzhou_project: null,   // 'people_first' | 'fame_project' | 'relation_contract' | 'bypass_process'
  hangzhou_account: null,   // 'open_account' | 'result_only' | 'private_margin' | 'overcautious'
  // 儋州
  danzhou_teach: null,     // 'open_teach' | 'selective_teach' | 'closed_door' | 'fame_suffering'
  danzhou_life: null,      // 'live_with_people' | 'poetry_only' | 'resentment' | 'help_people'
  tangzuo: null,           // 'spark' | 'polite' | 'missed' | 'fame_use'
  // Boolean flags
  account_dirty: false,
  life_cold: false
}

// Default state
function getDefaultState() {
  return {
    currentScene: 'S00',
    variables: {
      qingfeng: 50,  // 公私边界，高=清
      fenggu: 50,    // 风骨人格，高=强
      minsheng: 50,  // 民生责任，高=好
      yanhuo: 50,    // 烟火生活，高=暖
      qinyou: 50,    // 亲友负担，高=危险
      mingsheng: 50  // 名声风险，高=风险升
    },
    flags: { ...DEFAULT_FLAGS },
    visitedScenes: [],
    choiceHistory: [],
    itemsClicked: {},
    budget分配: {},
    audioEnabled: true,
    gameStarted: false,
    // Navigation history stack for in-game back button
    sceneHistory: [],
    // FactAdaptationBook visibility — NOT persisted (always reset on load)
    showFactBook: false,
    // Dialogue log — last 50 entries, NOT persisted
    dialogueLog: [],
    // DialogueLog overlay visibility — globally controllable
    showDialogueLog: false,
    // Archive wall / chapter transition overlays — NOT persisted
    showArchiveWall: false,
    archiveWallMode: 'opening',   // 'opening' | 'log' | 'retrospective' | 'chapter-transition'
    archiveWallChapter: 'meishan', // current chapter context
    archiveWallNarrate: '',        // narration text
    showChapterTransition: false,
    transitionFrom: '',            // previous chapter key
    transitionTo: '',              // next chapter key
    // Current game chapter (for progress tracking)
    currentChapter: 'meishan',
  }
}

// Create reactive store
const savedState = loadState()
const defaultState = getDefaultState()

// Merge saved state with defaults to handle new fields
function initState() {
  if (savedState) {
    return {
      ...defaultState,
      ...savedState,
      // Always reset transient UI state from saved state
      showFactBook: false,
      dialogueLog: [],
      showDialogueLog: false,
      // Archive wall / chapter transition — never persist across sessions
      showArchiveWall: false,
      archiveWallMode: 'opening',
      archiveWallChapter: 'meishan',
      archiveWallNarrate: '',
      showChapterTransition: false,
      transitionFrom: '',
      transitionTo: '',
      currentChapter: savedState.currentChapter || 'meishan',
      variables: { ...defaultState.variables, ...(savedState.variables || {}) },
      flags: { ...DEFAULT_FLAGS, ...(savedState.flags || {}) }
    }
  }
  return defaultState
}

export const gameState = reactive(initState())

// Auto-save on changes
let saveTimeout = null
function debouncedSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (e) {
      if (import.meta.env.DEV) console.warn('Failed to save:', e)
    }
  }, 500)
}

watch(gameState, debouncedSave, { deep: true })


// ─── Dialogue Log ─────────────────────────────────────────────────────────────

const MAX_LOG_ENTRIES = 50

export function addLogEntry({ type, sceneId, content, meta }) {
  gameState.dialogueLog.push({
    id: Date.now() + Math.random(),
    type,
    sceneId: sceneId || gameState.currentScene,
    content: content || '',
    meta: meta || null,
    ts: Date.now()
  })
  if (gameState.dialogueLog.length > MAX_LOG_ENTRIES) {
    gameState.dialogueLog.splice(0, gameState.dialogueLog.length - MAX_LOG_ENTRIES)
  }
}

export function getLogDisplay(limit = 20) {
  const log = gameState.dialogueLog
  return log.slice(Math.max(0, log.length - limit), log.length)
}

// ─── Core Actions ────────────────────────────────────────────────────────────

export function setScene(sceneId) {
  // Push current scene to history before navigating
  if (gameState.currentScene && gameState.currentScene !== sceneId) {
    gameState.sceneHistory.push(gameState.currentScene)
  }
  gameState.currentScene = sceneId
  if (!gameState.visitedScenes.includes(sceneId)) {
    gameState.visitedScenes.push(sceneId)
  }
  // Auto-log scene entry
  addLogEntry({ type: 'scene_enter', sceneId, content: '' })
}

/**
 * Go back to previous scene using the navigation history stack.
 * Returns the previous scene id, or null if stack is empty.
 */
export function goBackScene() {
  if (gameState.sceneHistory.length === 0) return null
  gameState.currentScene = gameState.sceneHistory.pop()
  return gameState.currentScene
}

/**
 * Apply a choice: record history, update variables, set flag.
 * Choice format: { id, group, value, variables }
 * group/value sets gameState.flags[group] = value
 */
// SceneId → flag group mapping for choice.flag inference
const SCENE_FLAG_GROUP = {
  S21: 'expression',
  S24: 'ziyou',
  S27: 'governance',
  S28: 'governance',
  S29: 'governance',
  S32: 'meat',
  S33: 'cook',
  S36: 'meat',
  S37: 'cook',
  S41: 'huai',
  // 杭州
  S45: 'hangzhou_project',
  S46: 'hangzhou_account',
  // 儋州
  S51: 'danzhou_teach',
  S52: 'danzhou_life',
  S53: 'tangzuo'
}

export function applyChoice(choice, sceneId) {
  gameState.choiceHistory.push({ sceneId, choiceId: choice.id })

  // Apply variables
  if (choice.variables) {
    for (const [key, delta] of Object.entries(choice.variables)) {
      if (gameState.variables[key] !== undefined) {
        gameState.variables[key] = Math.max(0, Math.min(100, gameState.variables[key] + delta))
      }
    }
  }

  // Set named flag — supports both {group, value} and {flag} formats
  if (choice.group && choice.value) {
    gameState.flags[choice.group] = choice.value
  } else if (choice.flag) {
    const group = SCENE_FLAG_GROUP[sceneId]
    if (group) gameState.flags[group] = choice.flag
  }
}

/**
 * Add extra variables for combo/conditional bonuses.
 * Returns hint string if triggered.
 */
export function applyCombo(addVariables, hint) {
  if (!addVariables) return null
  for (const [key, delta] of Object.entries(addVariables)) {
    if (gameState.variables[key] !== undefined) {
      gameState.variables[key] = Math.max(0, Math.min(100, gameState.variables[key] + delta))
    }
  }
  return hint
}

export function setDirtyFlag() {
  gameState.flags.account_dirty = true
}

export function setColdFlag() {
  gameState.flags.life_cold = true
}

export function recordItemClick(sceneId, itemId) {
  if (!gameState.itemsClicked[sceneId]) {
    gameState.itemsClicked[sceneId] = []
  }
  if (!gameState.itemsClicked[sceneId].includes(itemId)) {
    gameState.itemsClicked[sceneId].push(itemId)
  }
}

export function recordBudget分配(item, amount) {
  gameState.budget分配[item] = amount
}

export function toggleAudio() {
  gameState.audioEnabled = !gameState.audioEnabled
}

export function setAudioEnabled(enabled) {
  gameState.audioEnabled = !!enabled
}

// ─── Archive Wall / Chapter Transition ─────────────────────────────────────────

export function showArchiveWall({ mode = 'opening', chapter = 'meishan', narrate = '' } = {}) {
  gameState.showArchiveWall = true
  gameState.archiveWallMode = mode
  gameState.archiveWallChapter = chapter
  gameState.archiveWallNarrate = narrate
}

export function hideArchiveWall() {
  gameState.showArchiveWall = false
}

export function showChapterTransition(fromChapter, toChapter) {
  gameState.showChapterTransition = true
  gameState.transitionFrom = fromChapter
  gameState.transitionTo = toChapter
}

export function hideChapterTransition() {
  gameState.showChapterTransition = false
}

/**
 * 一次性关闭所有非必要浮层（无场景切换时手动调用）。
 * 不影响：剧情场景、对话、章节标记。
 * 影响：档案墙 / 章节转场墙 / 日志 / 菜单 / 史实改编卡。
 */
export function closeAllOverlays() {
  hideArchiveWall()
  hideChapterTransition()
  gameState.showDialogueLog = false
  gameState.showFactBook = false
}

export function resetGame() {
  const saved = localStorage.getItem(STORAGE_KEY)
  const parsed = saved ? JSON.parse(saved) : null
  const audioPref = parsed ? parsed.audioEnabled : true
  Object.assign(gameState, getDefaultState())
  gameState.audioEnabled = audioPref
  gameState.gameStarted = false
  gameState.sceneHistory = []
  // Reset archive wall / transition overlays
  gameState.showArchiveWall = false
  gameState.archiveWallMode = 'opening'
  gameState.archiveWallChapter = 'meishan'
  gameState.archiveWallNarrate = ''
  gameState.showChapterTransition = false
  gameState.transitionFrom = ''
  gameState.transitionTo = ''
  gameState.currentChapter = 'meishan'
}

export function startGame() {
  gameState.gameStarted = true
}


// ─── Variable Feedback ────────────────────────────────────────────────────────

export function getVariableFeedback(variableKey, delta) {
  const labels = {
    qingfeng: {
      positive: ['清风账添一笔。', '这次，账是清的。'],
      negative: ['清风账亏了一截。', '边界模糊了。']
    },
    fenggu: {
      positive: ['风骨账亮了一点。', '他没有把自己弄丢。'],
      negative: ['风骨账暗了一度。', '这次，他把自己丢了一部分。']
    },
    minsheng: {
      positive: ['民生账上有光。', '他还记得百姓。'],
      negative: ['民生账冷了一些。', '他暂时顾不上别人了。']
    },
    yanhuo: {
      positive: ['烟火账亮了一点。', '日子没有变轻，但锅里有了热气。'],
      negative: ['烟火账暗了一些。', '冷锅冷灶。']
    },
    // 亲友账：高=危险（负担加重），低=好（负担减轻）
    qinyou: {
      positive: ['亲友账加重。', '子由又替你多扛了一段路。'],
      negative: ['亲友账减轻了一点。', '这一段，他自己走过去了。']
    },
    // 名声账：高=风险升高（不是好事）
    mingsheng: {
      positive: ['名声账风险升高。', '才华照亮了你，也把你推向风口。'],
      negative: ['名声账沉寂了一些。', '风浪暂时平息。']
    }
  }
  const keyLabels = labels[variableKey]
  if (!keyLabels) return ''
  const list = delta > 0 ? keyLabels.positive : keyLabels.negative
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Returns CSS class for variable bar in result/poster:
 * - qingfeng/fenggu/minsheng/yanhuo: high=green, low=red
 * - qinyou: high=red (danger), low=green (safe)
 * - mingsheng: always amber (neutral risk indicator)
 */
export function getVarBarClass(key, value) {
  if (key === 'qinyou') {
    if (value >= 70) return 'risk-high'
    if (value <= 35) return 'risk-low'
    return 'risk-mid'
  }
  if (key === 'mingsheng') {
    return 'risk-neutral'
  }
  // Standard: high=good, low=bad
  if (value >= 70) return 'high'
  if (value <= 30) return 'low'
  return 'medium'
}

// ─── Ending Resolution ────────────────────────────────────────────────────────

export function resolveEnding(state) {
  const v = state.variables
  const f = state.flags

  // Priority 1: 子由太累了
  if (v.qinyou >= 80 || (f.ziyou === 'accepted_no_reflection' && f.huai === 'hot_words')) {
    return 'ziyou_tired'
  }

  // Priority 2: 糊涂账倾向
  if (f.account_dirty === true || (v.qingfeng < 45 && v.yanhuo >= 60)) {
    return 'confused_account'
  }

  // Priority 3: 天涯仍有光（儋州余火传灯）
  if (f.danzhou_teach === 'open_teach' && f.tangzuo === 'spark' && v.minsheng >= 65 && v.fenggu >= 65) {
    return 'tianya_light'
  }

  // Priority 4: 糊涂账倾向（含杭州）
  if (f.account_dirty === true || f.hangzhou_project === 'relation_contract' || f.hangzhou_account === 'private_margin') {
    return 'confused_account'
  }

  // Priority 5: 月光很冷（黄州/儋州）
  if (v.fenggu < 45 || v.yanhuo < 45 || f.life_cold === true || f.danzhou_teach === 'closed_door' || f.danzhou_life === 'resentment') {
    return 'cold_moon'
  }

  // Priority 6: 黄州清风初成
  if (v.qingfeng >= 70 && v.fenggu >= 65 && v.yanhuo >= 65 && v.qinyou < 75) {
    return 'qingfeng_born'
  }

  // Priority 7: 东坡正在落地
  return 'dongpo_landing'
}

export const ENDINGS = {
  ziyou_tired: {
    id: 'ziyou_tired',
    title: '子由太累了',
    seal: '倦',
    content: '风暴过去了。\n\n但每一页背后，都有子由的影子。\n\n你一次次让苏轼撑过危机，\n也一次次让亲人替他多扛一段路。\n\n清风账本提醒：亲情不是无限救援系统。'
  },
  confused_account: {
    id: 'confused_account',
    title: '糊涂账倾向',
    seal: '糊',
    content: '你让黄州的锅热起来了，\n也让账本多了几处模糊。\n\n烟火气不是清廉的反面。\n糊涂账才是。'
  },
  cold_moon: {
    id: 'cold_moon',
    title: '月光很冷',
    seal: '寒',
    content: '你让苏轼避开了一些风险，\n也避开了很多生活。\n\n黄州的月光仍在，\n可他还没有真正走进去。'
  },
  qingfeng_born: {
    id: 'qingfeng_born',
    title: '黄州清风初成',
    seal: '成',
    content: '你没有把苏轼玩成完美圣人。\n他仍会嘴馋，会疲惫，会在夜里找怀民。\n\n但这一路，他没有让账本糊掉。\n\n黄州的火慢慢烧着。\n东坡正在诞生。'
  },
  dongpo_landing: {
    id: 'dongpo_landing',
    title: '东坡正在落地',
    seal: '待',
    content: '黄州没有立刻治好他。\n但至少，日子开始有了一点热气。\n\n风还在吹。\n东坡正在落地。'
  },
  tianya_light: {
    id: 'tianya_light',
    title: '天涯仍有光',
    seal: '灯',
    content: '你没有把苏轼做成悲壮的烈士。\n他仍会疲惫，会孤独，会在夜里想家。\n\n但他把一盏灯留在了天涯。\n姜唐佐走了，但他会带着这点光回去。\n\n余火传灯。\n这不是一个人的故事，但它从一个人开始。'
  },
}

// Export state for analytics
export function getStateSnapshot() {
  return {
    currentScene: gameState.currentScene,
    variables: { ...gameState.variables },
    flags: { ...gameState.flags },
    visitedScenes: [...gameState.visitedScenes],
    choiceHistory: [...gameState.choiceHistory]
  }
}
