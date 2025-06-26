import { useUsers, useUser } from '../hooks/useUsers.ts'

function Profile() {
  const { data: allUsers } = useUsers()
  const { data: user } = useUser({ id: 1 })
  const mutateUser = useUsers()

  // mutateUser.add.mutate({
  //   auth_id: 'abcd',
  //   name: 'test',
  //   class: 'warrior',
  // })

  // function updateUser() {
  //   mutateUser.update.mutate({ id: 5, xp: 100, int: 3, dex: 20 })
  // }

  // <button onClick={updateUser}>updateUser</button>

  // console.log('component', user)
  // console.log('component all users', allUsers)

  return (
    <div className="m-10 flex items-center justify-items-end rounded-2xl ring-2 ring-black ">
      <img src="/warrior3.png" alt="character" className="h-40 w-40" />
      <div className="grid grid-cols-2">
        <p>Name: </p>
        <p>{user?.name}</p>
        <p>Class: </p>
        <p>{user?.class}</p>
        <p>Rank: </p>
        <p>{user?.rank}</p>
        <p>Level: </p>
        <p>{user?.level}</p>
        <p>XP:</p> <p>{user?.xp}</p>
        <p>Strength:</p> <p>{user?.str}</p>
        <p>Dexterity:</p> <p>{user?.dex}</p>
        <p>Intelligence:</p> <p>{user?.int}</p>
      </div>
    </div>
  )
}

export default Profile
