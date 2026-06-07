import React from 'react'
import LetterMatchGame from './LetterMatchGame'
import PhonemeGame from './PhonemeGame'
import MatchingGame from './MatchingGame'

export default function GameSelector() {
  const [selectedGame, setSelectedGame] = React.useState(null)

  if (selectedGame === 'letterMatch') {
    return <LetterMatchGame onBack={() => setSelectedGame(null)} />
  }

  if (selectedGame === 'phoneme') {
    return <PhonemeGame onBack={() => setSelectedGame(null)} />
  }

  if (selectedGame === 'matching') {
    return <MatchingGame onBack={() => setSelectedGame(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
      {/* 标题 */}
      <div className="text-center mb-12 animate-float">
        <h1 className="text-5xl font-extrabold text-white mb-2">
          PhonicWorld
        </h1>
        <p className="text-xl text-white/80">
          让我们一起学习自然拼读吧！
        </p>
      </div>

      {/* 游戏选择卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        {/* 字母匹配游戏 */}
        <button
          onClick={() => setSelectedGame('letterMatch')}
          className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-left group"
        >
          <div className="bg-indigo-100 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-5xl">🔤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">字母匹配</h2>
          <p className="text-gray-600">
            看图片，选出正确的首字母！<br />
            适合初学者
          </p>
          <div className="mt-4 flex items-center text-indigo-500 font-medium">
            开始游戏 →
          </div>
        </button>

        {/* 音素识别游戏 */}
        <button
          onClick={() => setSelectedGame('phoneme')}
          className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-left group"
        >
          <div className="bg-green-100 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-5xl">🎧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">音素识别</h2>
          <p className="text-gray-600">
            听发音，选出对应的字母！<br />
            考验你的听力
          </p>
          <div className="mt-4 flex items-center text-green-500 font-medium">
            开始游戏 →
          </div>
        </button>

        {/* 翻牌连连看游戏 */}
        <button
          onClick={() => setSelectedGame('matching')}
          className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-left group"
        >
          <div className="bg-orange-100 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-5xl">🃏</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">翻牌连连看</h2>
          <p className="text-gray-600">
            翻牌配对，单词对应图案！<br />
            考验记忆力
          </p>
          <div className="mt-4 flex items-center text-orange-500 font-medium">
            开始游戏 →
          </div>
        </button>
      </div>

      {/* 底部装饰 */}
      <div className="mt-12 text-center text-white/60 text-sm">
        <p>选择你喜欢的小游戏开始学习吧</p>
      </div>
    </div>
  )
}
