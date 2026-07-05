// 统一数据服务层
// 负责从 JSON 静态文件（或未来替换为 API/SQLite）加载词库数据

const cache = new Map()

/**
 * 加载 JSON 数据文件，带内存缓存
 * @param {string} path - 数据文件路径
 * @returns {Promise<any>}
 */
async function loadJson(path) {
  if (cache.has(path)) {
    return cache.get(path)
  }

  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  cache.set(path, data)
  return data
}

/**
 * 清除数据缓存，用于需要重新加载数据的场景
 */
export function clearDataCache() {
  cache.clear()
}

/**
 * 获取字母数据
 */
export async function getLetters() {
  const data = await loadJson('/data/letters.json')
  return data.letters
}

/**
 * 获取字母匹配游戏单词数据
 */
export async function getWords() {
  const data = await loadJson('/data/words.json')
  return data.words
}

/**
 * 获取翻牌连连看单词数据
 */
export async function getMatchingWords() {
  const data = await loadJson('/data/matching-words.json')
  return data.words
}

/**
 * 获取关卡配置
 */
export async function getLevels() {
  const data = await loadJson('/data/levels.json')
  return data.levels
}

/**
 * 获取所有拼读规则分类
 */
export async function getPhonicsCategories() {
  const words = await getMatchingWords()
  const categories = [...new Set(words.map(w => w.phonics).filter(Boolean))]
  return categories
}

/**
 * 按拼读规则筛选单词
 * @param {string} phonics - 拼读规则，如 '-at'
 */
export async function getWordsByPhonics(phonics) {
  const words = await getMatchingWords()
  return words.filter(w => w.phonics === phonics)
}

// 默认导出对象形式，方便统一引用
const DataService = {
  getLetters,
  getWords,
  getMatchingWords,
  getLevels,
  getPhonicsCategories,
  getWordsByPhonics,
  clearDataCache,
}

export default DataService
