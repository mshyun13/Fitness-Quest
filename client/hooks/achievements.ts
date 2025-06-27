import { useQuery } from '@tanstack/react-query'
import { getAllAchievements } from '../apis/achievements'

export function useAchievements() {
  const query = useQuery({
    queryKey: ['achievements'],
    queryFn: getAllAchievements,
  })
  return {
    ...query,
  }
}
