import React, { useState, useEffect } from 'react'
import { letters, getRandomOptions } from '../data/gameData'
import { playLetterSound, playSound } from '../utils/audio'
import LetterCard from './LetterCard'

export default function PhonemeGame({ onBack }) {
  const [currentLetter, setCurrentLetter] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const [playCount, setPlayCount] = useState(0)

  const TOTAL_ROUNDS = 10
  const MAX_PLAY_COUNT = 3

  useEffect(() => {
    loadNewRound()
  }, [])

  function loadNewRound() {
    if (round > TOTAL_ROUNDS) {
      setGameOver(true)
      return
    }

    // 随机选择一个字母
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    setCurrentLetter(randomLetter)
    setOptions(getRandomOptions(randomLetter.letter, letters.map(l => l.letter)))
    setSelectedOption(null)
    setIsCorrect(null)
    setCanPlay(true)
    setPlayCount(0)

    // 自动播放一次发音
    setTimeout(() => {
      playLetterSound(randomLetter.letter)
      setPlayCount(1)
    }, 300)
  }

  function handlePlaySound() {
    if (!canPlay || !currentLetter) return

    if (playCount < MAX_PLAY_COUNT) {
      playLetterSound(currentLetter.letter)
      setPlayCount(prev => prev + 1)
    }
  }

  function handleOptionClick(letter) {
    if (selectedOption || !canPlay) return

    setSelectedOption(letter)
    const correct = letter === currentLetter.letter
    setIsCorrect(correct)
    setCanPlay(false)

    if (correct) {
      setScore(prev => prev + 10)
      playSound('success')
    } else {
      playSound('error')
    }

    // 2秒后进入下一轮
    setTimeout(() => {
      setRound(prev => prev + 1)
      loadNewRound()
    }, 1500)
  }

  function restartGame() {
    setScore(0)
    setRound(1)
    setGameOver(false)
    loadNewRound()
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">太棒了！</h2>
          <p className="text-gray-600 mb-6">你完成了所有关卡！</p>
          <div className="bg-green-100 rounded-2xl p-4 mb-6">
            <p className="text-lg text-gray-600">最终得分</p>
            <p className="text-5xl font-bold text-green-600">{score}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={restartGame}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              再玩一次
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              返回主页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-600 flex flex-col p-4">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="bg-white/20 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-colors"
        >
          ← 返回
        </button>
        <div className="flex gap-4 text-white">
          <span className="font-medium">关卡 {round}/{TOTAL_ROUNDS}</span>
          <span className="font-medium">得分: {score}</span>
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {currentLetter && (
          <>
            {/* 发音按钮 */}
            <button
              onClick={handlePlaySound}
              disabled={!canPlay || playCount >= MAX_PLAY_COUNT}
              className={`
                w-40 h-40 rounded-full flex flex-col items-center justify-center
                text-white text-lg font-bold shadow-xl mb-8
                transition-all duration-300
                ${canPlay
                  ? 'bg-white/30 hover:bg-white/40 hover:scale-105 cursor-pointer'
                  : 'bg-white/10 cursor-not-allowed'
                }
                ${playCount >= MAX_PLAY_COUNT ? 'ring-4 ring-yellow-400' : ''}
              `}
            >
              <span className="text-5xl mb-2">🔊</span>
              <span>点击听发音</span>
              <span className="text-sm opacity-70">剩余 {MAX_PLAY_COUNT - playCount} 次</span>
            </button>

            {/* 选项卡片 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {options.map((letter, index) => (
                <div
                  key={`${letter}-${index}`}
                  className="animate-bounce-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <LetterCard
                    letter={letter}
                    isSelected={selectedOption === letter}
                    isCorrect={isCorrect && selectedOption === letter}
                    isWrong={!isCorrect && selectedOption === letter}
                    onClick={() => handleOptionClick(letter)}
                    disabled={!!selectedOption || !canPlay}
                  />
                </div>
              ))}
            </div>

            {/* 提示文字 */}
            <p className="text-white/80 text-center">
              选择你听到的字母发音
            </p>
          </>
        )}
      </div>
    </div>
  )
}
