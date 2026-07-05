// 音频工具：云 TTS + 本地音效
// 单词/字母发音由 src/services/tts 提供，支持本地 Web Speech 和 Azure 云 TTS 切换

export {
  prepareTTS,
  speak,
  playLetterSound,
  playWordSound,
  getTTSInfo,
} from '../services/tts'

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// 在用户点击时解锁音频上下文（Safari / Chrome 必需）
export async function ensureAudioReady() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

// 播放游戏音效（成功 / 失败 / 点击）
export async function playSound(type) {
  try {
    const ctx = getAudioContext()
    await ensureAudioReady()

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (type === 'success') {
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime)
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.4)
    } else if (type === 'error') {
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    } else if (type === 'click') {
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    }
  } catch (err) {
    console.warn('playSound failed:', err)
  }
}
