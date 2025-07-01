import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addUserByAuth0,
  getAllUsers,
  getLeaderboard,
  getUserByAuth0,
  updateUserByAuth0,
} from '../apis/users.ts'
import { useAuth0 } from '@auth0/auth0-react'
import { User } from '../../models/users.ts'

export function useUsers() {
  const query = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  return {
    ...query,
  }
}

export function useLeaderboard() {
  const query = useQuery({ queryKey: ['users'], queryFn: getLeaderboard })
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

// get User by auth0 ID

export function useUserByAuth0() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!user || !user.sub) {
        throw new Error('Auth0 user ID (sub) is not available.')
      }
      const token = await getAccessTokenSilently()
      return getUserByAuth0({ token, auth0Id: user.sub })
    },
    enabled: !!user?.sub,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return {
    ...query,
    add: useAddUserByAuth0(),
    update: useUpdateUserByAuth0(),
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

export function useUpdateUserByAuth0() {
  const { getAccessTokenSilently } = useAuth0()

  const mutationFn: MutationFunction<
    number,
    Partial<Omit<User, 'id' | 'auth_id'>>
  > = async (updates) => {
    const token = await getAccessTokenSilently()
    return updateUserByAuth0(updates, token)
  }
  return useUserMutation(mutationFn)
}
