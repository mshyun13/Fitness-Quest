import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { addSideQuest, getSideQuestsById } from '../apis/sidequests.ts'

// get side quest by auth0 ID

export function useSideQuests(userId: number | undefined) {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['sidequests', userId],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getSideQuestsById({ id: userId, token })
    },
    enabled: !!user && userId !== undefined && userId !== null && userId !== 0,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return {
    ...query,
  }
}

export function useAddSideQuestsQuery() {
  return {
    add: useAddSideQuest(),
  }
}

export function useSideQuestMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sidequests'] })
    },
  })
  return mutation
}

export function useAddSideQuest() {
  return useSideQuestMutation(addSideQuest)
}
