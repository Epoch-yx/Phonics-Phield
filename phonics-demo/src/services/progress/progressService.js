// 学习进度本地持久化服务
// 以知识点（单词/字母/phonics 规则）掌握度为核心，而非按游戏记录

const STORAGE_KEY = 'phonic-world-progress'
const CURRENT_VERSION = 1

const DEFAULT_DATA = {
  version: CURRENT_VERSION,
  profile: {
    totalSessions: 0,
    streakDays: 0,
    lastStudyDate: null,
    totalStudyMinutes: 0,
  },
  mastery: {},
  phonicsMastery: {},
  letterMastery: {},
  gameRecords: {
    letterMatch: { bestScore: 0, totalPlays: 0 },
    phoneme: { bestScore: 0, totalPlays: 0 },
    matching: { bestScore: 0, totalPlays: 0, currentLevel: 1 },
  },
  settings: {
    ttsProvider: 'webSpeech',
    soundEnabled: true,
  },
}

function load() {
  if (typeof window === 'undefined') return { ...DEFAULT_DATA }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { ...DEFAULT_DATA }

  try {
    const parsed = JSON.parse(raw)
    // 合并默认值，处理版本升级时新增字段
    return {
      ...DEFAULT_DATA,
      ...parsed,
      profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },
      gameRecords: {
        letterMatch: { ...DEFAULT_DATA.gameRecords.letterMatch, ...(parsed.gameRecords?.letterMatch || {}) },
        phoneme: { ...DEFAULT_DATA.gameRecords.phoneme, ...(parsed.gameRecords?.phoneme || {}) },
        matching: { ...DEFAULT_DATA.gameRecords.matching, ...(parsed.gameRecords?.matching || {}) },
      },
      settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
    }
  } catch {
    return { ...DEFAULT_DATA }
  }
}

function save(data) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function updateStreak(profile) {
  const today = getTodayString()
  const last = profile.lastStudyDate

  if (!last || last === today) {
    profile.lastStudyDate = today
    return
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  if (last === yesterdayString) {
    profile.streakDays += 1
  } else {
    profile.streakDays = 1
  }
  profile.lastStudyDate = today
}

function ensureMasteryEntry(map, key) {
  if (!map[key]) {
    map[key] = { correct: 0, wrong: 0, total: 0, lastSeen: null }
  }
  return map[key]
}

function calculateStatus(entry) {
  if (entry.total < 3) return 'learning'
  const rate = entry.correct / entry.total
  if (rate >= 0.85 && entry.correct >= 5) return 'mastered'
  if (rate >= 0.6) return 'familiar'
  return 'learning'
}

function updatePhonicsMastery(data, phonics) {
  if (!phonics || phonics === 'extra') return

  const words = Object.entries(data.mastery)
    .filter(([_, v]) => v.phonics === phonics)

  if (words.length === 0) return

  const totalCorrect = words.reduce((sum, [_, v]) => sum + v.correct, 0)
  const totalWrong = words.reduce((sum, [_, v]) => sum + v.wrong, 0)
  const total = totalCorrect + totalWrong

  data.phonicsMastery[phonics] = {
    correct: totalCorrect,
    wrong: totalWrong,
    total,
    accuracy: total > 0 ? totalCorrect / total : 0,
    status: total > 0 ? calculateStatus({ correct: totalCorrect, wrong: totalWrong, total }) : 'learning',
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * 记录一次学习结果
 * @param {Object} payload
 * @param {string} payload.word - 单词（可选）
 * @param {string} payload.letter - 字母（可选）
 * @param {string} payload.phonics - 拼读规则，如 '-at'（可选）
 * @param {boolean} payload.isCorrect - 是否答对
 * @param {string} payload.game - 游戏标识：letterMatch | phoneme | matching
 */
export function recordResult({ word, letter, phonics, isCorrect, game }) {
  const data = load()
  const now = new Date().toISOString()

  // 更新学习档案
  updateStreak(data.profile)
  data.profile.totalSessions += 1

  // 更新游戏战绩
  if (game && data.gameRecords[game]) {
    data.gameRecords[game].totalPlays += 1
  }

  // 更新单词掌握度
  if (word) {
    const entry = ensureMasteryEntry(data.mastery, word.toLowerCase())
    entry.word = word
    entry.phonics = phonics || entry.phonics
    if (isCorrect) entry.correct += 1
    else entry.wrong += 1
    entry.total += 1
    entry.lastSeen = now
    entry.status = calculateStatus(entry)

    updatePhonicsMastery(data, phonics || entry.phonics)
  }

  // 更新字母掌握度
  if (letter) {
    const key = letter.toUpperCase()
    const entry = ensureMasteryEntry(data.letterMastery, key)
    entry.letter = key
    if (isCorrect) entry.correct += 1
    else entry.wrong += 1
    entry.total += 1
    entry.lastSeen = now
    entry.status = calculateStatus(entry)
  }

  save(data)
}

/**
 * 记录游戏结束分数
 * @param {string} game - letterMatch | phoneme | matching
 * @param {number} score - 本局得分
 * @param {number} [level] - 翻牌连连看当前关卡
 */
export function recordGameEnd(game, score, level) {
  const data = load()

  if (data.gameRecords[game]) {
    data.gameRecords[game].bestScore = Math.max(data.gameRecords[game].bestScore, score)
    if (game === 'matching' && level) {
      data.gameRecords.matching.currentLevel = Math.max(data.gameRecords.matching.currentLevel, level + 1)
    }
  }

  save(data)
}

/**
 * 获取学习进度摘要
 */
export function getProgressSummary() {
  const data = load()
  const masteryList = Object.values(data.mastery)
  const letterList = Object.values(data.letterMastery)

  return {
    streakDays: data.profile.streakDays,
    totalSessions: data.profile.totalSessions,
    lastStudyDate: data.profile.lastStudyDate,
    masteredWords: masteryList.filter(m => m.status === 'mastered').length,
    learningWords: masteryList.filter(m => m.status === 'learning').length,
    masteredLetters: letterList.filter(m => m.status === 'mastered').length,
    totalWordsPracticed: masteryList.length,
    totalLettersPracticed: letterList.length,
    gameRecords: data.gameRecords,
    phonicsMastery: data.phonicsMastery,
  }
}

/**
 * 获取某单词/字母的掌握度
 */
export function getMastery(key) {
  const data = load()
  return data.mastery[key.toLowerCase()] || data.letterMastery[key.toUpperCase()] || null
}

/**
 * 获取需要加强练习的单词（掌握度低的）
 * @param {number} limit - 返回数量
 */
export function getWeakWords(limit = 10) {
  const data = load()
  return Object.entries(data.mastery)
    .filter(([_, v]) => v.status !== 'mastered')
    .sort((a, b) => a[1].correct / (a[1].total || 1) - b[1].correct / (b[1].total || 1))
    .slice(0, limit)
    .map(([word, info]) => ({ word, ...info }))
}

/**
 * 获取设置
 */
export function getSettings() {
  return load().settings
}

/**
 * 更新设置
 */
export function updateSettings(patch) {
  const data = load()
  data.settings = { ...data.settings, ...patch }
  save(data)
}

/**
 * 导出学习数据（JSON 字符串）
 */
export function exportData() {
  return JSON.stringify(load(), null, 2)
}

/**
 * 导入学习数据
 */
export function importData(json) {
  const parsed = JSON.parse(json)
  const merged = { ...DEFAULT_DATA, ...parsed }
  save(merged)
}

/**
 * 重置所有学习进度
 */
export function resetProgress() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

const ProgressService = {
  recordResult,
  recordGameEnd,
  getProgressSummary,
  getMastery,
  getWeakWords,
  getSettings,
  updateSettings,
  exportData,
  importData,
  resetProgress,
}

export default ProgressService
