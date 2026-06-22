import React, { useState, useEffect } from 'react'
import { matchingWords, shuffleArray, levelConfig } from '../data/gameData'
import { playWordSound, playSound } from '../utils/audio'
import { WordImage } from '../assets/wordImages'

// 护眼配色主题
const THEME = {
  bg: 'from-emerald-900 via-teal-900 to-cyan-900',
  cardBack: 'from-emerald-700 to-teal-700',
  cardFront: 'from-stone-100 to-stone-200',
  success: 'bg-green-600',
  text: 'text-stone-800',
  accent: 'text-amber-400',
  muted: 'text-stone-300',
}

export default function MatchingGame({ onBack }) {
  const [gameState, setGameState] = useState('select') // select | playing | complete
  const [currentLevel, setCurrentLevel] = useState(1)
  const [leftCards, setLeftCards] = useState([])
  const [rightCards, setRightCards] = useState([])
  const [flippedLeft, setFlippedLeft] = useState(null)
  const [flippedRight, setFlippedRight] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [canFlip, setCanFlip] = useState(true)
  const [totalPairs, setTotalPairs] = useState(0)
  const [usedWords, setUsedWords] = useState([])

  // 开始指定关卡
  function startLevel(level) {
    const config = levelConfig[level - 1]
    setCurrentLevel(level)
    setTotalPairs(config.pairs)
    initGame(config.pairs)
    setGameState('playing')
  }

  function initGame(pairs) {
    // 随机选择指定数量的单词对（避免重复）
    const availableWords = matchingWords.filter(w => !usedWords.includes(w.word))
    const selectedWords = shuffleArray(availableWords).slice(0, pairs)

    // 左侧卡片（单词）
    const left = selectedWords.map((item, index) => ({
      id: `left-${index}`,
      word: item.word,
      emoji: item.emoji,
      isFlipped: false,
    }))

    // 右侧卡片（图案）
    const right = selectedWords.map((item, index) => ({
      id: `right-${index}`,
      word: item.word,
      emoji: item.emoji,
      isFlipped: false,
    }))

    setLeftCards(shuffleArray(left))
    setRightCards(shuffleArray(right))
    setFlippedLeft(null)
    setFlippedRight(null)
    setMatchedPairs([])
    setScore(0)
    setMoves(0)
    setCanFlip(true)
  }

  function handleLeftCardClick(card) {
    if (!canFlip || card.isFlipped || matchedPairs.includes(card.word)) return

    playSound('click')

    const newCards = leftCards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )
    setLeftCards(newCards)
    setFlippedLeft(card)

    if (flippedRight) {
      checkMatch(card, flippedRight)
    }
  }

  function handleRightCardClick(card) {
    if (!canFlip || card.isFlipped || matchedPairs.includes(card.word)) return

    playSound('click')

    const newCards = rightCards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )
    setRightCards(newCards)
    setFlippedRight(card)

    if (flippedLeft) {
      checkMatch(flippedLeft, card)
    }
  }

  function checkMatch(leftCard, rightCard) {
    setCanFlip(false)
    setMoves(prev => prev + 1)

    if (leftCard.word === rightCard.word) {
      // 匹配成功
      setTimeout(() => {
        playSound('success')
        setMatchedPairs(prev => [...prev, leftCard.word])
        setScore(prev => prev + 20)
        setFlippedLeft(null)
        setFlippedRight(null)
        setCanFlip(true)

        // 检查是否全部完成
        if (matchedPairs.length + 1 === totalPairs) {
          setTimeout(() => {
            setUsedWords(prev => [...prev, ...matchedPairs, leftCard.word])
            setGameState('complete')
          }, 500)
        }
      }, 500)
    } else {
      // 匹配失败
      setTimeout(() => {
        playSound('error')

        // 翻回卡片
        setLeftCards(cards =>
          cards.map(c => c.id === leftCard.id ? { ...c, isFlipped: false } : c)
        )
        setRightCards(cards =>
          cards.map(c => c.id === rightCard.id ? { ...c, isFlipped: false } : c)
        )

        setFlippedLeft(null)
        setFlippedRight(null)
        setCanFlip(true)
      }, 1000)
    }
  }

  function playWord(word) {
    playWordSound(word).catch(() => {})
  }

  // 关卡选择画面
  if (gameState === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex flex-col p-4">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="bg-white/10 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            ← 返回
          </button>
          <h1 className="text-2xl font-bold text-white">翻牌连连看</h1>
          <div className="w-20"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-stone-300 mb-8 text-center">
            选择关卡开始游戏<br />
            <span className="text-sm opacity-70">匹配单词和对应图案</span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            {levelConfig.map((config) => {
              const isUnlocked = config.level === 1 || usedWords.length >= (config.level - 1) * 4
              return (
                <button
                  key={config.level}
                  onClick={() => isUnlocked && startLevel(config.level)}
                  disabled={!isUnlocked}
                  className={`
                    p-6 rounded-2xl text-center transition-all duration-300
                    ${isUnlocked
                      ? 'bg-white/10 hover:bg-white/20 hover:scale-105 cursor-pointer'
                      : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-3xl font-bold text-amber-400 mb-1">
                    {config.level}
                  </div>
                  <div className="text-white font-medium mb-1">{config.name}</div>
                  <div className="text-stone-400 text-sm">{config.pairs} 对卡片</div>
                  {!isUnlocked && (
                    <div className="text-stone-500 text-xs mt-2">🔒</div>
                  )}
                </button>
              )
            })}
          </div>

          {usedWords.length > 0 && (
            <p className="text-stone-400 mt-6 text-sm">
              已学习 {Math.floor(usedWords.length / 4)} 关
            </p>
          )}
        </div>
      </div>
    )
  }

  // 通关画面
  if (gameState === 'complete') {
    const accuracy = moves > 0 ? Math.round((totalPairs / moves) * 100) : 100
    const nextLevel = currentLevel < levelConfig.length ? currentLevel + 1 : null

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
        <div className="bg-stone-800/80 backdrop-blur rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in border border-stone-700">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-amber-400 mb-2">
            第 {currentLevel} 关完成！
          </h2>
          <p className="text-stone-300 mb-6">{levelConfig[currentLevel - 1].name}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-700/50 rounded-2xl p-4">
              <p className="text-stone-400 text-sm">得分</p>
              <p className="text-3xl font-bold text-amber-400">{score}</p>
            </div>
            <div className="bg-stone-700/50 rounded-2xl p-4">
              <p className="text-stone-400 text-sm">准确率</p>
              <p className="text-3xl font-bold text-green-400">{accuracy}%</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {nextLevel && (
              <button
                onClick={() => startLevel(nextLevel)}
                className="w-full bg-amber-500 text-stone-900 py-3 rounded-xl font-semibold hover:bg-amber-400 transition-colors"
              >
                下一关（第 {nextLevel} 关）
              </button>
            )}
            <button
              onClick={() => startLevel(currentLevel)}
              className="w-full bg-stone-600 text-white py-3 rounded-xl font-semibold hover:bg-stone-500 transition-colors"
            >
              再玩一次
            </button>
            <button
              onClick={() => setGameState('select')}
              className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              返回关卡选择
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 游戏进行中
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex flex-col">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center px-6 py-4">
        <button
          onClick={() => setGameState('select')}
          className="bg-white/10 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-colors"
        >
          ← 返回
        </button>
        <div className="text-center">
          <div className="text-amber-400 font-bold text-xl">第 {currentLevel} 关</div>
          <div className="text-stone-300 text-sm">{levelConfig[currentLevel - 1].name}</div>
        </div>
        <div className="flex gap-6 text-white">
          <span className="font-medium text-lg">{matchedPairs.length}/{totalPairs}</span>
          <span className="font-medium text-lg">{score}分</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-stone-700/50 h-3">
        <div
          className="bg-amber-400 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(matchedPairs.length / totalPairs) * 100}%` }}
        />
      </div>

      {/* 游戏说明 */}
      <p className="text-stone-300 text-center py-3 text-lg">
        点击左侧单词，再点击右侧对应图案
      </p>

      {/* 游戏区域 - 充分利用空间 */}
      <div className="flex-1 flex flex-col lg:flex-row justify-center items-stretch px-4 pb-4 gap-4">
        {/* 左侧卡牌（单词） */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-3xl p-4">
          <h3 className="text-amber-400 font-bold text-xl mb-4">单词</h3>
          <div className={`grid gap-3 ${getGridCols(totalPairs)} justify-items-center`}>
            {leftCards.map((card, index) => (
              <div
                key={card.id}
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Card
                  card={card}
                  isFlipped={card.isFlipped || matchedPairs.includes(card.word)}
                  isMatched={matchedPairs.includes(card.word)}
                  onClick={() => handleLeftCardClick(card)}
                  type="word"
                  onPlayWord={playWord}
                  cardSize={getCardSize(totalPairs)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 中间分隔符 */}
        <div className="flex items-center justify-center text-5xl text-stone-500 lg:px-4">↔</div>

        {/* 右侧卡牌（图案） */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-3xl p-4">
          <h3 className="text-amber-400 font-bold text-xl mb-4">图案</h3>
          <div className={`grid gap-3 ${getGridCols(totalPairs)} justify-items-center`}>
            {rightCards.map((card, index) => (
              <div
                key={card.id}
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Card
                  card={card}
                  isFlipped={card.isFlipped || matchedPairs.includes(card.word)}
                  isMatched={matchedPairs.includes(card.word)}
                  onClick={() => handleRightCardClick(card)}
                  type="image"
                  cardSize={getCardSize(totalPairs)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 根据卡牌数量获取网格列数和卡牌大小
function getGridCols(pairs) {
  if (pairs <= 4) return 'grid-cols-2'
  if (pairs <= 6) return 'grid-cols-3'
  if (pairs <= 8) return 'grid-cols-4'
  return 'grid-cols-4'
}

function getCardSize(pairs) {
  if (pairs <= 4) return 'large'
  if (pairs <= 6) return 'medium'
  if (pairs <= 8) return 'small'
  return 'tiny'
}

// 卡牌组件
function Card({ card, isFlipped, isMatched, onClick, type, onPlayWord, cardSize = 'medium' }) {
  const sizeConfig = {
    large: { width: 'w-36 h-44', text: 'text-2xl', image: 120, iconSize: 'text-4xl' },
    medium: { width: 'w-28 h-36', text: 'text-xl', image: 96, iconSize: 'text-3xl' },
    small: { width: 'w-24 h-32', text: 'text-lg', image: 80, iconSize: 'text-2xl' },
    tiny: { width: 'w-20 h-24', text: 'text-base', image: 64, iconSize: 'text-xl' },
  }

  const { width, text, image, iconSize } = sizeConfig[cardSize]

  if (isMatched) {
    return (
      <div className={`${width} rounded-2xl ${THEME.success} flex items-center justify-center shadow-lg opacity-70`}>
        <span className="text-white text-3xl">✓</span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${width} rounded-2xl shadow-xl transition-all duration-300
        ${isFlipped
          ? 'bg-white'
          : 'bg-gradient-to-br from-emerald-600 to-teal-600 hover:scale-105 active:scale-95'
        }
      `}
    >
      {isFlipped ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {type === 'word' ? (
            <>
              <span className={`font-bold ${THEME.text} ${text}`}>
                {card.word}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onPlayWord(card.word)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onPlayWord(card.word)
                  }
                }}
                className="mt-2 bg-emerald-100 px-3 py-1 rounded-full hover:bg-emerald-200 flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </span>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <WordImage word={card.word} size={image} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`${iconSize} text-white/80`}>?</span>
        </div>
      )}
    </button>
  )
}
