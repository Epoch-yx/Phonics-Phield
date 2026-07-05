import { useState, useEffect } from 'react'

/**
 * 通用数据加载 Hook
 * @param {Function} fetcher - 返回 Promise 的数据获取函数
 * @param {Array<any>} deps - 依赖数组
 * @returns {{ data: any, loading: boolean, error: Error | null, refetch: Function }}
 */
export function useGameData(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err)
      console.error('Failed to load game data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch: fetchData }
}

/**
 * 加载多个数据源的 Hook
 * @param {Array<{ key: string, fetcher: Function }>} sources
 * @returns {{ data: Object, loading: boolean, error: Error | null }}
 */
export function useGameDataSet(sources) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      setLoading(true)
      setError(null)
      try {
        const entries = await Promise.all(
          sources.map(async ({ key, fetcher }) => {
            const value = await fetcher()
            return [key, value]
          })
        )
        if (!cancelled) {
          setData(Object.fromEntries(entries))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          console.error('Failed to load game data set:', err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAll()

    return () => {
      cancelled = true
    }
  }, [sources])

  return { data, loading, error }
}

export default useGameData
