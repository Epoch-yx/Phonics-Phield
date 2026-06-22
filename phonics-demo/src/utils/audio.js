// Web Speech API + Web Audio 播放工具

let audioContext = null
let voicesPromise = null

function getSynth() {
  return typeof window !== 'undefined' ? window.speechSynthesis : null
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function waitForVoices() {
  if (voicesPromise) return voicesPromise

  voicesPromise = new Promise((resolve) => {
    const synth = getSynth()
    if (!synth) {
      resolve([])
      return
    }

    const finish = () => {
      clearInterval(pollId)
      clearTimeout(timeoutId)
      resolve(synth.getVoices())
    }

    if (synth.getVoices().length > 0) {
      resolve(synth.getVoices())
      return
    }

    synth.addEventListener('voiceschanged', finish, { once: true })

    const pollId = setInterval(() => {
      if (synth.getVoices().length > 0) finish()
    }, 100)

    const timeoutId = setTimeout(finish, 3000)
  })

  return voicesPromise
}

function pickEnglishVoice(voices) {
  return (
    voices.find((v) => v.lang.startsWith('en') && v.localService) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null
  )
}

// 在用户点击时解锁语音（Safari / Chrome 必需）
export async function ensureAudioReady() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const synth = getSynth()
  if (!synth) return

  synth.getVoices()
  await waitForVoices()
}

function speakText(text, { rate = 0.8, pitch = 1.1 } = {}) {
  return new Promise(async (resolve, reject) => {
    const synth = getSynth()
    if (!synth) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    try {
      await ensureAudioReady()
    } catch (err) {
      reject(err)
      return
    }

    const voices = await waitForVoices()
    const voice = pickEnglishVoice(voices)
    const wasSpeaking = synth.speaking || synth.pending

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = 1
      if (voice) utterance.voice = voice

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(event.error || event)

      synth.speak(utterance)
    }

    // cancel 后立即 speak 在 Chrome/Safari 会静默失败，需短暂延迟
    if (wasSpeaking) {
      synth.cancel()
      setTimeout(doSpeak, 150)
    } else {
      doSpeak()
    }
  })
}

export function playLetterSound(letter) {
  return speakText(letter.toLowerCase(), { rate: 0.8, pitch: 1.2 })
}

export function playWordSound(word) {
  return speakText(word, { rate: 0.7, pitch: 1.1 })
}

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
