import { WebSpeechProvider } from './providers/webSpeechProvider'
import { AzureTTSProvider } from './providers/azureTTSProvider'

// 当前激活的 Provider
let activeProvider = null

function createProvider() {
  const providerName = import.meta.env.VITE_TTS_PROVIDER || 'webSpeech'

  switch (providerName) {
    case 'azure':
      return new AzureTTSProvider({
        key: import.meta.env.VITE_AZURE_TTS_KEY,
        region: import.meta.env.VITE_AZURE_TTS_REGION,
        voiceName: import.meta.env.VITE_AZURE_TTS_VOICE || 'en-US-AriaNeural',
      })
    case 'webSpeech':
    default:
      return new WebSpeechProvider()
  }
}

function getProvider() {
  if (!activeProvider) {
    activeProvider = createProvider()
  }
  return activeProvider
}

/**
 * 预加载 TTS（例如提前获取 voice 列表或校验配置）
 */
export async function prepareTTS() {
  const provider = getProvider()
  await provider.prepare()
}

/**
 * 朗读文本
 * @param {string} text - 要朗读的内容
 * @param {Object} options - 语速/音高等配置
 * @returns {Promise<void>}
 */
export async function speak(text, options = {}) {
  const provider = getProvider()
  try {
    await provider.speak(text, options)
  } catch (err) {
    console.warn(`TTS Provider "${provider.name}" 播放失败:`, err)

    // 如果云 TTS 失败，自动降级到本地 Web Speech
    if (provider.name !== 'webSpeech') {
      console.info('降级到本地 Web Speech API')
      const fallback = new WebSpeechProvider()
      await fallback.speak(text, options)
      return
    }

    throw err
  }
}

/**
 * 朗读字母（更清晰、稍慢）
 */
export function playLetterSound(letter) {
  return speak(letter.toLowerCase(), { rate: 0.7, pitch: 1.2 })
}

/**
 * 朗读单词
 */
export function playWordSound(word) {
  return speak(word, { rate: 0.75, pitch: 1.1 })
}

/**
 * 切换 Provider（用于动态切换，如设置页）
 */
export function setTTSProvider(provider) {
  activeProvider = provider
}

/**
 * 获取当前 Provider 信息
 */
export function getTTSInfo() {
  const provider = getProvider()
  return { name: provider.name, label: provider.label }
}

export { WebSpeechProvider, AzureTTSProvider }
