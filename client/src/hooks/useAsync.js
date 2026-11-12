import { useCallback, useState } from 'react'

// Wraps an async fn with { data, error, loading } state.
export function useAsync(fn) {
  const [state, setState] = useState({ data: null, error: null, loading: false })

  const run = useCallback(async (...args) => {
    setState((s) => ({ ...s, error: null, loading: true }))
    try {
      const data = await fn(...args)
      setState({ data, error: null, loading: false })
      return data
    } catch (e) {
      setState({ data: null, error: e.message, loading: false })
      return undefined
    }
  }, [fn])

  const reset = useCallback(() => setState({ data: null, error: null, loading: false }), [])
  return { ...state, run, reset }
}
