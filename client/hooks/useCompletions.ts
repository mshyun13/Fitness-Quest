import { useState, useEffect } from 'react'
import { CompletionOfChallenge } from '../../models/completionsModel'
import { useAuth0 } from '@auth0/auth0-react'
import { getCompletions as getCompletionsApi } from '../apis/completions'

interface UseCompletionsResult {
  completions: CompletionOfChallenge[]
  loading: boolean
  error: string | null
  refreshCompletions: () => void
}

export function useCompletions(): UseCompletionsResult {
  console.log('useCompletions: Hook rendered')
  const [completions, setCompletions] = useState<CompletionOfChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()

  const getCompletions = async () => {
    console.log('getCompletions: Function called')

    if (!isAuthenticated || !user?.sub) {
      console.log(
        'getCompletions: User not authenticated or sub missing (expected if not logged in)',
      )
      setLoading(false)
      setError('Authentication required to fetch completions.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getCompletionsApi(getAccessTokenSilently)
      console.log('getCompletions: API call successful, data received:', data)
      setCompletions(data)
    } catch (err) {
      console.error('getCompletions: API call failed:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
      console.error('Failed to get completions:', err)
    } finally {
      setLoading(false)
      console.log('getCompletions: Function finished.')
    }
  }

  useEffect(() => {
    console.log(
      'useEffect: Triggered. isAuthenticated:',
      isAuthenticated,
      'user:',
      user,
    )
    if (isAuthenticated && user?.sub) {
      getCompletions()
    } else if (!isAuthenticated && !loading) {
      setError('Not authenticated.')
      setLoading(false)
      setCompletions([]) // Clear completions if not authenticated
    }
  }, [isAuthenticated, user?.sub, getAccessTokenSilently])

  return { completions, loading, error, refreshCompletions: getCompletions }
}
