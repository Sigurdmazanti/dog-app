import { useState, useCallback } from 'react'
import { debounce } from 'tamagui'

type FetchFn<T> = (search: string, pageNum: number, pageSize: number) => Promise<T[]>

export function useDebouncedFetch<T>(
  fetchFn: FetchFn<T>,
  pageSize: number,
  debounceMs = 300
) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)

  const debouncedFetch = useCallback(
    debounce(async (search: string, pageNum: number) => {
      setLoading(true)
      try {
        const data = await fetchFn(search, pageNum, pageSize)
        setItems(prev => (pageNum === 1 ? data : [...prev, ...data]))
        setHasMore(data.length === pageSize)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, debounceMs),
    [fetchFn, pageSize, debounceMs]
  )

  return {
    items,
    hasMore,
    loading,
    debouncedFetch,
    setItems,
    setHasMore,
    setLoading,
  }
}
