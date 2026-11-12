import { useCallback, useEffect, useState } from 'react'

// Loads data on mount; call reload() to refetch (e.g. after a create).
export function useLoad(fn) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  const reload = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }))
      setState({ data: await fn(), error: null, loading: false })
    } catch (e) {
      setState({ data: null, error: e.message, loading: false })
    }
  }, [fn])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}
