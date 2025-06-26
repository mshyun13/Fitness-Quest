import { useUsers, useUser } from '../hooks/useUsers.ts'

function Profile() {
  const { data: allUsers } = useUsers()
  const { data: user } = useUser({ id: 2 })
  const mutateUser = useUsers()

  // mutateUser.add.mutate({
  //   auth_id: 'abcd',
  //   name: 'test',
  //   class: 'warrior',
  // })

  // function updateUser() {
  //   mutateUser.update.mutate({ id: 5, xp: 100, int: 3, dex: 20 })
  // }

  // console.log('component', user)
  // console.log('component all users', allUsers)

  return <>{/* <button onClick={updateUser}>updateUser</button> */}</>
}

export default Profile
