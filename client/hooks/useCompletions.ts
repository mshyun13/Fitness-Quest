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

  const { isAuthenticated, user /*getAccessTokenSilently*/ } = useAuth0()

  const getCompletions = async () => {
    console.log('getCompletions: Function called')
    let userId: string | undefined = undefined
    // let accessToken: string | undefined = undefined

    if (isAuthenticated && user?.sub) {
      userId = user.sub
      console.log('getCompletions: Authenticated user, userId:', userId)
      // try {
      //   accessToken = await getAccessTokenSilently();
      // } catch (tokenError) {
      //   console.error('Failed to get access token:', tokenError);
      //   setError('Failed to get authentication token');
      //   setLoading(false);
      //   return;
      // }
    } else {
      userId = '2'
      console.log('getCompletions: Hardcoded user, userId:', userId)
    }

    if (!userId) {
      console.log('getCompletions: No userId available, stopping.')
      setLoading(false)
      setError('Unauthenticated bro!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('getCompletions: Calling API function for userId:', userId)
      const data = await getCompletionsApi(userId /*, getAccessTokenSilently */)
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
    if (isAuthenticated || user === undefined) {
      getCompletions()
    }
  }, [isAuthenticated, user?.sub /* , getAccessTokenSilently */])

  return { completions, loading, error, refreshCompletions: getCompletions }
}
