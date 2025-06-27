import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addUser,
  addUserByAuth0,
  getAllUsers,
  getUserByAuth0,
  getUserById,
  updateUser,
} from '../apis/users.ts'
import { useAuth0 } from '@auth0/auth0-react'

export function useUsers() {
  const query = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  return {
    ...query,
    add: useAddUser(),
    update: useUpdateUser(),
  }
}

interface ID {
  id: number
}

export function useUser({ id }: ID) {
  const query = useQuery({ queryKey: ['user'], queryFn: () => getUserById(id) })
  return {
    ...query,
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

function useUpdateUser() {
  return useUsersMutation(updateUser)
}

// get User by auth0 ID

export function useUserByAuth0() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getUserByAuth0(token)
    },
    enabled: !!user,
  })

  return {
    ...query,
    add: useAddUserByAuth0(),
  }
}

// mutation for new register user with Auth0

export function useUserMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
  return mutation
}

export function useAddUserByAuth0() {
  return useUserMutation(addUserByAuth0)
}
