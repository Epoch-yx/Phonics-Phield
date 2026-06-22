// 儿童风格图片组件
// 使用本地真实图片资源

import React, { useState } from 'react'

// 可用的图片单词列表
const availableImages = [
  'ant', 'ax', 'bag', 'bat', 'bed', 'bib', 'big', 'bin', 'bud', 'bug',
  'bun', 'can', 'cap', 'cat', 'cot', 'cub', 'cup', 'cut', 'dad', 'dam',
  'dig', 'dot', 'egg', 'fan', 'fig', 'fin', 'fox', 'fun', 'gum', 'hat',
  'hen', 'hip', 'hit', 'hop', 'hot', 'hug', 'hum', 'hut', 'in', 'ink',
  'jam', 'jet', 'jug', 'kid', 'lid', 'lip', 'log', 'man', 'map', 'mat',
  'mix', 'mop', 'mud', 'mug', 'nap', 'net', 'nut', 'ox', 'pad', 'pan',
  'pen', 'pet', 'pin', 'pit', 'pop', 'pot', 'pup', 'rag', 'ram', 'rat',
  'red', 'rib', 'rip', 'rod', 'rub', 'rug', 'run', 'sip', 'six', 'sun', 'tap', 'ten',
  'tip', 'toip', 'tub', 'up', 'vet', 'web', 'wet', 'wig', 'win', 'yak',
  'yam', 'zip'
]

// 主组件 - 根据单词显示对应图片
export const WordImage = ({ word, size = 64 }) => {
  const lowerWord = word.toLowerCase()
  const [error, setError] = useState(false)

  // 检查图片是否存在
  const imagePath = `/images/${lowerWord}.jpg`
  const isAvailable = availableImages.includes(lowerWord)

  if (!isAvailable || error) {
    // 如果图片不存在，显示占位符
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '8px',
          backgroundColor: '#E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.3,
          fontWeight: 'bold',
          color: '#999'
        }}
      >
        {word.slice(0, 3).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={imagePath}
      alt={word}
      width={size}
      height={size}
      style={{
        borderRadius: '8px',
        objectFit: 'cover'
      }}
      onError={() => setError(true)}
    />
  )
}

export default WordImage
