import { useFruits } from '../hooks/useFruits.ts'
import { useUsers, useUser } from '../hooks/useUsers.ts'

function App() {
  const { data } = useFruits()
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
      <div className="app">
        <h1 className="text-3xl font-bold underline">
          Fullstack Boilerplate - with Fruits!
        </h1>
        <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul>
      </div>
    </>
  )
}

export default App
