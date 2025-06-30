import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { addSideQuest, getSideQuestsById } from '../apis/sidequests.ts'

// get side quest by auth0 ID

export function useSideQuests(id: number) {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['sidequests'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getSideQuestsById({ id, token })
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return {
    ...query,
  }
}

export function useAddSideQuestsQuery() {
  const { getAccessTokenSilently } = useAuth0()
  const id = 0
  const query = useQuery({
    queryKey: ['sidequests'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getSideQuestsById({ id, token })
    },
  })

  return {
    ...query,
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
