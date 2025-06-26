import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { addUser, getAllUsers, getUserById } from '../apis/users.ts'

export function useUsers() {
  const query = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  return {
    ...query,
    // Extra queries go here e.g. addFruit: useAddFruit()
    add: useAddUser(),
  }
}

interface ID {
  id: number
}

export function useUser({ id }: ID) {
  const query = useQuery({ queryKey: ['user'], queryFn: () => getUserById(id) })
  return {
    ...query,
    // Extra queries go here e.g. addFruit: useAddFruit()
  }
}

export function useUsersMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return mutation
}

function useAddUser() {
  return useUsersMutation(addUser)
}
