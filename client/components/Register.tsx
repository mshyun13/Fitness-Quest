import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import { useUserByAuth0 } from '../hooks/useUsers'

const newUserData = {
  name: '',
  xp: 0,
  level: 0,
  rank: 'bronze',
  str: 0,
  dex: 0,
  int: 0,
  missed: 0,
  class: '',
  appearance: 0,
}

function Register() {
  const [newUser, setNewUser] = useState(newUserData)
  const { getAccessTokenSilently } = useAuth0()
  const user = useUserByAuth0()
  const navigate = useNavigate()

  const { name: newName, class: newClass } = newUser

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evt.target
    setNewUser({
      ...newUser,
      [id]: value,
    })
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    const token = await getAccessTokenSilently()
    evt.preventDefault()
    user.add.mutate({ newUser, token })
    navigate('/')
  }

  useEffect(() => {
    if (user.data) {
      navigate('/')
    }
  }, [user.data, navigate])

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl">
        <h2 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          Register
        </h2>
        <div className="justify-items-center">
          <form onSubmit={handleSubmit} className="mb-4 flex w-96 flex-col">
            <label className="mb-2">Name: </label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={handleChange}
              className="mb-2 text-black"
            />
            <label className="mb-2">Preferred Class: </label>
            <input
              type="text"
              id="class"
              value={newClass}
              onChange={handleChange}
              className="mb-2 text-black"
            />
            <button
              type="submit"
              className="mb-4 cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                               transition duration-200 hover:bg-gray-600"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
