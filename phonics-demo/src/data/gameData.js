// 游戏数据工具函数
// 注意：词库数据已迁移到 public/data/*.json，请通过 src/services/dataService.js 加载

// 获取随机选项（包含正确答案和3个干扰项）
export function getRandomOptions(correctLetter, allLetters) {
  const options = [correctLetter]
  const otherLetters = allLetters.filter(l => l !== correctLetter)

  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * otherLetters.length)
    const randomLetter = otherLetters[randomIndex]
    if (!options.includes(randomLetter)) {
      options.push(randomLetter)
    }
  }

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5)
}

// 打乱数组
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
