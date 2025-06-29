import { ChangeEventHandler, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
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

  const [newCharacter, setCharacter] = useState('')

  const { name: newName, class: newClass } = newUser

  const handleChange = (
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const { id, value } = evt.target
    setNewUser({
      ...newUser,
      [id]: value,
    })
  }

  const handleCharacterChange = (
    evt: ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const { id, value } = evt.target
    setNewUser({
      ...newUser,
      [id]: value,
    })
    setCharacter(value)
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    const token = await getAccessTokenSilently()
    evt.preventDefault()
    user.add.mutate({ newUser, token })
    navigate('/')
  }

  console.log(newCharacter)
  console.log(newUser)

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
            <label htmlFor="name" className="mb-2">
              Name:{' '}
            </label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={handleChange}
              className="mb-2 text-black"
            />

            <label htmlFor="gender">Gender: </label>
            <select
              id="gender"
              onChange={handleChange}
              className="mb-2 text-black"
            >
              <option value="" disabled selected>
                Select your option
              </option>
              <option value={'male'}>male</option>
              <option value={'female'}>female</option>
              <option value={'cat'}>cat</option>
            </select>

            <label htmlFor="class" className="mb-2">
              Class:{' '}
            </label>
            {/* <input
              type="text"
              id="class"
              value={newClass}
              onChange={handleChange}
              className="mb-2 text-black"
            /> */}
            <select
              id="class"
              onChange={handleChange}
              className="mb-2 text-black"
            >
              <option value="" disabled selected>
                Select your option
              </option>
              <option value={'warrior'}>warrior</option>
              <option value={'rogue'}>rogue</option>
              <option value={'mage'}>mage</option>
            </select>

            <label htmlFor="character" className="mb-2">
              Character:{' '}
            </label>
            <select
              id="appearance"
              onChange={handleCharacterChange}
              className="mb-2 text-black"
            >
              <option value="" disabled selected>
                Select your option
              </option>
              <option value={'1'}>1</option>
              <option value={'2'}>2</option>
              <option value={'3'}>3</option>
              <option value={'4'}>4</option>
              <option value={'5'}>5</option>
            </select>

            <img
              src={`/characters/${newUser.gender}${newUser.class}${newUser.appearance}.webp`}
              alt="new character"
              className="mb-2"
            />

            {}

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
