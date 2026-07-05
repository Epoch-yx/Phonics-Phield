// Web Speech API 本地 TTS Provider
// 作为默认和 fallback 方案，无需网络密钥

let voicesPromise = null

function getSynth() {
  return typeof window !== 'undefined' ? window.speechSynthesis : null
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
  // 优先选 Google 美语或本地英文童声/女声
  return (
    voices.find((v) => v.lang === 'en-US' && v.name.includes('Google')) ||
    voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('samantha')) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null
  )
}

export class WebSpeechProvider {
  name = 'webSpeech'
  label = '浏览器本地语音'

  async speak(text, { rate = 0.8, pitch = 1.1 } = {}) {
    const synth = getSynth()
    if (!synth) {
      throw new Error('当前浏览器不支持 Web Speech API')
    }

    const voices = await waitForVoices()
    const voice = pickEnglishVoice(voices)

    return new Promise((resolve, reject) => {
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

      if (wasSpeaking) {
        synth.cancel()
        setTimeout(doSpeak, 150)
      } else {
        doSpeak()
      }
    })
  }

  async prepare() {
    const synth = getSynth()
    if (!synth) return
    await waitForVoices()
  }
}
