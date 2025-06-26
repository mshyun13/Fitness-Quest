import { useState, useEffect } from 'react'
import { CompletionOfChallenge } from '../../models/completionsModel'
import { useAuth0 } from '@auth0/auth0-react'

interface UseCompletionsResult {
  completions: CompletionOfChallenge[]
  loading: boolean
  error: string | null
  refreshCompletions: () => void
}

export function useCompletions(): UseCompletionsResult {
  const [completions, setCompletions] = useState<CompletionOfChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated, user /*getAccessTokenSilently*/ } = useAuth0()

  const getCompletions = async () => {
    let userId: string | undefined = undefined
    // let accessToken: string | undefined = undefined

    if (isAuthenticated && user?.sub) {
      userId = user.sub

      // try {
      //   accessToken = await getAccessTokenSilently();
      // } catch (tokenError) {
      //   console.error('Failed to get access token:', tokenError);
      //   setError('Failed to get authentication token');
      //   setLoading(false);
      //   return;
      // }
    } else {
      userId = 'github|204113180'
    }

    if (!userId) {
      setLoading(false)
      setError('Unauthenticated bro!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {}
      // if (accessToken) {
      //   headers['Authorization'] = `Bearer ${accessToken}`;
      // }

      const response = await fetch(`/api/v1/completions/${userId}`, {
        headers: headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`)
      }
      const data: CompletionOfChallenge[] = await response.json()
      setCompletions(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
      console.error('Failed to get completions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated || user === undefined) {
      getCompletions()
    }
  }, [isAuthenticated, user?.sub /* , getAccessTokenSilently */])

  return { completions, loading, error, refreshCompletions: getCompletions }
}
