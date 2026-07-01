import React, { useState, useEffect } from 'react'
import { words, letters, getRandomOptions, shuffleArray } from '../data/gameData'
import { playWordSound, playSound } from '../utils/audio'
import LetterCard from './LetterCard'

export default function LetterMatchGame({ onBack }) {
  const [currentWord, setCurrentWord] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showWord, setShowWord] = useState(false)

  const TOTAL_ROUNDS = 10

  useEffect(() => {
    loadNewRound()
  }, [])

  function loadNewRound() {
    if (round > TOTAL_ROUNDS) {
      setGameOver(true)
      return
    }

    // 随机选择一个单词
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setOptions(getRandomOptions(randomWord.firstLetter, letters.map(l => l.letter)))
    setSelectedOption(null)
    setIsCorrect(null)
    setShowWord(false)

    // 延迟显示单词，先播放发音
    setTimeout(() => {
      playWordSound(randomWord.word)
      setShowWord(true)
    }, 500)
  }

  function handleOptionClick(letter) {
    if (selectedOption || !showWord) return

    setSelectedOption(letter)
    const correct = letter === currentWord.firstLetter
    setIsCorrect(correct)

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

  function handleReplay() {
    if (currentWord) {
      playWordSound(currentWord.word)
    }
  }

  function restartGame() {
    setScore(0)
    setRound(1)
    setGameOver(false)
    loadNewRound()
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">太棒了！</h2>
          <p className="text-gray-600 mb-6">你完成了所有关卡！</p>
          <div className="bg-indigo-100 rounded-2xl p-4 mb-6">
            <p className="text-lg text-gray-600">最终得分</p>
            <p className="text-5xl font-bold text-indigo-600">{score}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={restartGame}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col p-4">
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
        {currentWord && (
          <>
            {/* 图片展示 */}
            <div
              className={`
                bg-white rounded-3xl p-8 mb-8 shadow-xl
                ${showWord ? 'animate-bounce-in' : 'opacity-0'}
              `}
            >
              <div className="text-9xl mb-4">{currentWord.emoji}</div>
              <div className="text-2xl font-bold text-gray-800">
                {showWord ? currentWord.word : '?'}
              </div>
            </div>

            {/* 播放按钮 */}
            <button
              onClick={handleReplay}
              disabled={!showWord}
              className="bg-white/20 text-white px-6 py-3 rounded-full font-medium mb-8 hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              🔊 再听一次
            </button>

            {/* 选项卡片 */}
            <div className="grid grid-cols-2 gap-4">
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
                    disabled={!!selectedOption || !showWord}
                  />
                </div>
              ))}
            </div>

            {/* 提示文字 */}
            <p className="text-white/80 mt-6 text-center">
              选择与图片单词首字母匹配的选项
            </p>
          </>
        )}
      </div>
    </div>
  )
}
