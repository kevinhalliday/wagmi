import * as React from 'react'
import { providers } from 'ethers'

import { useProvider } from './useProvider'

type State = {
  loading: boolean
  error?: Error
  resolver?: providers.EnsResolver | null
}

const initialState: State = {
  loading: false,
}

type Config = {
  name?: string | null
  skip?: boolean
}

export const useEnsResolver = ({ name, skip }: Config = {}) => {
  const provider = useProvider()
  const [state, setState] = React.useState<State>(initialState)

  const getResolver = React.useCallback(
    async (name: string) => {
      try {
        setState((x) => ({ ...x, error: undefined, loading: true }))
        const resolver = await provider.getResolver(name)
        setState((x) => ({ ...x, loading: false, resolver }))
        return resolver
      } catch (_error) {
        const error = _error as Error
        setState((x) => ({ ...x, error, loading: false }))
      }
    },
    [provider],
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (!name || skip) return
    getResolver(name)
  }, [name])
  /* eslint-enable react-hooks/exhaustive-deps */

  return [
    { resolver: state.resolver, loading: state.loading, error: state.error },
    getResolver,
  ] as const
}