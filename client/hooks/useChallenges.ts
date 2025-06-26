import { useQuery } from '@tanstack/react-query'
import { getChallenges, getSingleChallenge } from '../apis/challenges'

export function useChallenges() {
  return useQuery({ queryKey: ['challenges'], queryFn: () => getChallenges() })
}

export function useChallenge(id: number) {
  return useQuery({
    queryKey: ['challenges', id],
    queryFn: () => getSingleChallenge(id),
  })
}
