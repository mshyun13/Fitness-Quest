import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addAchievements,
  getAchievementsById,
  getAllAchievements,
} from '../apis/achievements'

export function useAchievements() {
  const query = useQuery({
    queryKey: ['achievements'],
    queryFn: getAllAchievements,
  })
  return {
    ...query,
  }
}

export function useAchievementsById(id: number) {
  const query = useQuery({
    queryKey: ['achievementsById'],
    queryFn: () => getAchievementsById(id),
  })
  return {
    ...query,
    add: useAddAchievement(),
  }
}

export function useAchievementMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievementsById'] })
    },
  })

  return mutation
}

function useAddAchievement() {
  return useAchievementMutation(addAchievements)
}
