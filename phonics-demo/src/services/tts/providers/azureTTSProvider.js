// Microsoft Azure 云 TTS Provider
// 需要配置 VITE_AZURE_TTS_KEY 和 VITE_AZURE_TTS_REGION
// 文档：https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech

export class AzureTTSProvider {
  name = 'azure'
  label = 'Microsoft Azure 云语音'

  constructor({ key, region, voiceName = 'en-US-AriaNeural' } = {}) {
    this.key = key
    this.region = region
    this.voiceName = voiceName
  }

  async speak(text, { rate = 1.0, pitch = 'default' } = {}) {
    if (!this.key || !this.region) {
      throw new Error('Azure TTS 缺少 key 或 region，请检查环境变量')
    }

    const endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`

    // rate 0.5~2.0 映射为 SSML rate 字符串
    const rateString = typeof rate === 'number' ? `${(rate * 100).toFixed(0)}%` : rate
    const pitchString = pitch === 'default' ? 'default' : `${pitch}`

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${this.voiceName}">
          <prosody rate="${rateString}" pitch="${pitchString}">
            ${this.escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `.trim()

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        'User-Agent': 'PhonicWorld',
      },
      body: ssml,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Azure TTS 请求失败: ${response.status} ${errorText}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
      audio.onerror = (err) => {
        URL.revokeObjectURL(audioUrl)
        reject(err)
      }
      audio.play().catch(reject)
    })
  }

  async prepare() {
    // Azure 无需预加载，仅做配置校验
    if (!this.key || !this.region) {
      throw new Error('Azure TTS 配置不完整')
    }
  }

  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}
