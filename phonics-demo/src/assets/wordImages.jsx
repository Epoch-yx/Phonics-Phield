import React, { useState } from 'react'

/**
 * 单词图片组件
 * 根据单词自动匹配 /images/{word}.jpg，加载失败则显示占位符
 */
export const WordImage = ({ word, imageUrl, size = 64 }) => {
  const lowerWord = word.toLowerCase()
  const [error, setError] = useState(false)

  const imagePath = imageUrl || `/images/${lowerWord}.jpg`

  if (error) {
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
