// 字母数据：26个字母的基础数据
export const letters = [
  { letter: 'A', sound: 'a', emoji: '🍎' },
  { letter: 'B', sound: 'b', emoji: '🏀' },
  { letter: 'C', sound: 'c', emoji: '🐱' },
  { letter: 'D', sound: 'd', emoji: '🐕' },
  { letter: 'E', sound: 'e', emoji: '🥚' },
  { letter: 'F', sound: 'f', emoji: '🐟' },
  { letter: 'G', sound: 'g', emoji: '🍇' },
  { letter: 'H', sound: 'h', emoji: '🏠' },
  { letter: 'I', sound: 'i', emoji: '冰淇淋' },
  { letter: 'J', sound: 'j', emoji: '果酱' },
  { letter: 'K', sound: 'k', emoji: '🪁' },
  { letter: 'L', sound: 'l', emoji: '🦁' },
  { letter: 'M', sound: 'm', emoji: '🍈' },
  { letter: 'N', sound: 'n', emoji: '🌰' },
  { letter: 'O', sound: 'o', emoji: '🐙' },
  { letter: 'P', sound: 'p', emoji: '🦋' },
  { letter: 'Q', sound: 'q', emoji: '👸' },
  { letter: 'R', sound: 'r', emoji: '🌈' },
  { letter: 'S', sound: 's', emoji: '☀️' },
  { letter: 'T', sound: 't', emoji: '🌲' },
  { letter: 'U', sound: 'u', emoji: '☂️' },
  { letter: 'V', sound: 'v', emoji: '🦅' },
  { letter: 'W', sound: 'w', emoji: '🌊' },
  { letter: 'X', sound: 'x', emoji: '🦴' },
  { letter: 'Y', sound: 'y', emoji: '🪀' },
  { letter: 'Z', sound: 'z', emoji: '⚡' },
]

// 单词数据（字母匹配游戏用）
export const words = [
  { word: 'Apple', firstLetter: 'A', emoji: '🍎' },
  { word: 'Ball', firstLetter: 'B', emoji: '🏀' },
  { word: 'Cat', firstLetter: 'C', emoji: '🐱' },
  { word: 'Dog', firstLetter: 'D', emoji: '🐕' },
  { word: 'Egg', firstLetter: 'E', emoji: '🥚' },
  { word: 'Fish', firstLetter: 'F', emoji: '🐟' },
  { word: 'Grape', firstLetter: 'G', emoji: '🍇' },
  { word: 'House', firstLetter: 'H', emoji: '🏠' },
  { word: 'Ice cream', firstLetter: 'I', emoji: '🍦' },
  { word: 'Jelly', firstLetter: 'J', emoji: '🫐' },
  { word: 'Kite', firstLetter: 'K', emoji: '🪁' },
  { word: 'Lion', firstLetter: 'L', emoji: '🦁' },
  { word: 'Melon', firstLetter: 'M', emoji: '🍈' },
  { word: 'Nut', firstLetter: 'N', emoji: '🌰' },
  { word: 'Octopus', firstLetter: 'O', emoji: '🐙' },
  { word: 'Butterfly', firstLetter: 'B', emoji: '🦋' },
  { word: 'Queen', firstLetter: 'Q', emoji: '👸' },
  { word: 'Rainbow', firstLetter: 'R', emoji: '🌈' },
  { word: 'Sun', firstLetter: 'S', emoji: '☀️' },
  { word: 'Tree', firstLetter: 'T', emoji: '🌲' },
  { word: 'Umbrella', firstLetter: 'U', emoji: '☂️' },
  { word: 'Van', firstLetter: 'V', emoji: '🚐' },
  { word: 'Water', firstLetter: 'W', emoji: '💧' },
  { word: 'Fox', firstLetter: 'F', emoji: '🦊' },
  { word: 'Yak', firstLetter: 'Y', emoji: '�牦牛' },
  { word: 'Zebra', firstLetter: 'Z', emoji: '🦓' },
]

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

// 翻牌连连看 - 单词数据（只包含有对应图片的单词）
export const matchingWords = [
  // -at family
  { word: 'cat', emoji: '🐱' },
  { word: 'bat', emoji: '🦇' },
  { word: 'rat', emoji: '🐀' },
  { word: 'hat', emoji: '🎩' },
  { word: 'mat', emoji: '🧹' },
  { word: 'vat', emoji: '🫗' },

  // -an family
  { word: 'can', emoji: '🥫' },
  { word: 'fan', emoji: '🌀' },
  { word: 'man', emoji: '👨' },
  { word: 'pan', emoji: '🍳' },
  { word: 'ran', emoji: '🏃' },

  // -ap family
  { word: 'cap', emoji: '🧢' },
  { word: 'map', emoji: '🗺️' },
  { word: 'nap', emoji: '💤' },
  { word: 'tap', emoji: '🚰' },

  // -ad family
  { word: 'dad', emoji: '👨‍👧' },
  { word: 'pad', emoji: '📒' },

  // -ag family
  { word: 'bag', emoji: '👜' },
  { word: 'rag', emoji: '🧣' },

  // -am family
  { word: 'ham', emoji: '🍖' },
  { word: 'jam', emoji: '🫐' },
  { word: 'ram', emoji: '🐏' },
  { word: 'yam', emoji: '🍠' },
  { word: 'dam', emoji: '🏞️' },

  // -ot family
  { word: 'pot', emoji: '🫕' },
  { word: 'hot', emoji: '🔥' },
  { word: 'cot', emoji: '🛏️' },
  { word: 'dot', emoji: '🔴' },
  { word: 'rod', emoji: '🎣' },

  // -op family
  { word: 'top', emoji: '🔝' },
  { word: 'hop', emoji: '🐰' },
  { word: 'mop', emoji: '🧹' },
  { word: 'pop', emoji: '🎈' },

  // -ox family
  { word: 'fox', emoji: '🦊' },
  { word: 'ox', emoji: '🐂' },

  // -og family
  { word: 'log', emoji: '🪵' },
  { word: 'dog', emoji: '🐕' },
  { word: 'fog', emoji: '🌫️' },

  // -ed family
  { word: 'bed', emoji: '🛏️' },
  { word: 'red', emoji: '🔴' },

  // -et family
  { word: 'vet', emoji: '🏥' },
  { word: 'wet', emoji: '💧' },
  { word: 'pet', emoji: '🐾' },
  { word: 'jet', emoji: '✈️' },
  { word: 'net', emoji: '🥅' },

  // -en family
  { word: 'ten', emoji: '🔟' },
  { word: 'hen', emoji: '🐔' },
  { word: 'pen', emoji: '🖊️' },

  // -eb family
  { word: 'web', emoji: '🕸️' },

  // -ug family
  { word: 'bug', emoji: '🐛' },
  { word: 'hug', emoji: '🤗' },
  { word: 'mug', emoji: '☕' },
  { word: 'rug', emoji: '🧶' },
  { word: 'jug', emoji: '🏺' },

  // -ub family
  { word: 'cub', emoji: '🐻' },
  { word: 'tub', emoji: '🛁' },
  { word: 'rub', emoji: '✋' },

  // -ud family
  { word: 'mud', emoji: '🌱' },
  { word: 'bud', emoji: '🌸' },

  // -up family
  { word: 'cup', emoji: '🥤' },
  { word: 'pup', emoji: '🐶' },
  { word: 'up', emoji: '⬆️' },

  // -un family
  { word: 'sun', emoji: '☀️' },
  { word: 'run', emoji: '🏃' },
  { word: 'fun', emoji: '🎉' },
  { word: 'bun', emoji: '🥖' },
  { word: 'nut', emoji: '🌰' },
  { word: 'hut', emoji: '🏠' },
  { word: 'cut', emoji: '✂️' },

  // -ip family
  { word: 'lip', emoji: '👄' },
  { word: 'hip', emoji: '🦵' },
  { word: 'sip', emoji: '🥤' },
  { word: 'zip', emoji: '🤐' },

  // -in family
  { word: 'in', emoji: '➡️' },
  { word: 'fin', emoji: '🐟' },
  { word: 'bin', emoji: '🗑️' },
  { word: 'win', emoji: '🏆' },
  { word: 'tin', emoji: '🥫' },

  // -id family
  { word: 'kid', emoji: '👦' },
  { word: 'lid', emoji: '🍯' },
  { word: 'did', emoji: '✅' },

  // -ig family
  { word: 'big', emoji: '🐻' },
  { word: 'pig', emoji: '🐷' },
  { word: 'dig', emoji: '⛏️' },
  { word: 'fig', emoji: '🌿' },
  { word: 'wig', emoji: '👱' },

  // -it family
  { word: 'it', emoji: '❓' },
  { word: 'hit', emoji: '👊' },
  { word: 'pit', emoji: '🕳️' },
  { word: 'bit', emoji: '🦷' },

  // -ix family
  { word: 'six', emoji: '6️⃣' },
  { word: 'mix', emoji: '🥣' },

  // -id continued
  { word: 'bid', emoji: '🏷️' },
  { word: 'rib', emoji: '🍖' },
  { word: 'rip', emoji: '👖' },

  // extra words (all have images)
  { word: 'ant', emoji: '🐜' },
  { word: 'ax', emoji: '🪓' },
  { word: 'bib', emoji: '👶' },
  { word: 'egg', emoji: '🥚' },
  { word: 'gum', emoji: '口香糖' },
  { word: 'ink', emoji: '🖊️' },
  { word: 'log', emoji: '🪵' },
  { word: 'toip', emoji: '📬' },
  { word: 'yak', emoji: '🦬' },
]

// 关卡配置：每关的单词数量
export const levelConfig = [
  { level: 1, pairs: 4, name: '入门' },
  { level: 2, pairs: 6, name: '初级' },
  { level: 3, pairs: 8, name: '中级' },
  { level: 4, pairs: 10, name: '高级' },
  { level: 5, pairs: 12, name: '专家' },
  { level: 6, pairs: 14, name: '大师' },
]
