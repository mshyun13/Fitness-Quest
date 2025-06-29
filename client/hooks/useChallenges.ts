import { useQuery } from '@tanstack/react-query'
import { getChallenges, getSingleChallenge } from '../apis/challenges'
import { useAuth0 } from '@auth0/auth0-react'

export function useChallenges() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getChallenges(token)
    },
    enabled: isAuthenticated,
  })
}

export function useChallenge(id: number) {
  return useQuery({
    queryKey: ['challenges', id],
    queryFn: () => getSingleChallenge(id),
  })
}
