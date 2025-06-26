import { useUsers, useUser } from '../hooks/useUsers.ts'

function Profile() {
  const { data: allUsers } = useUsers()
  const { data: user } = useUser({ id: 2 })
  const addUser = useUsers()

  // addUser.add.mutate({
  //   auth_id: 'abcd',
  //   name: 'test',
  //   class: 'warrior',
  // })

  // console.log('component', user)
  // console.log('component all users', allUsers)

  return (
    <>
      <div></div>
    </>
  )
}

export default Profile
