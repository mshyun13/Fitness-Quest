import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useUserByAuth0 } from '../hooks/useUsers'
import { UserData } from '../../models/users'

const newUserData: UserData = {
  auth_id: '',
  name: '',
  class: 'warrior',
  gender: 'male', // user will get the rest once added to DB eg. XP, Level etc
  rank: 'bronze',
  appearance: 1,
}

function Register() {
  const [newUser, setNewUser] = useState<UserData>(newUserData)
  const {
    getAccessTokenSilently,
    user: auth0User,
    isAuthenticated,
    isLoading: isAuth0Loading,
  } = useAuth0()
  const {
    data: dbUser,
    isLoading: isDbUserLoading,
    isError: isDbUserError,
    add: addUserMutation,
  } = useUserByAuth0()
  const navigate = useNavigate()

  const [isImage, setImage] = useState(false)
  const [leftButton, setLeftButton] = useState(true)
  const [rightButton, setRightButton] = useState(false)

  const { name: newName } = newUser

  useEffect(() => {
    if (!isAuth0Loading && isAuthenticated && auth0User?.sub) {
      setNewUser((prev) => ({
        ...prev,
        auth_id: auth0User.sub!,
        name: prev.name || auth0User.name || auth0User.nickname || '',
      }))
    }
  }, [isAuth0Loading, isAuthenticated, auth0User])

  useEffect(() => {
    if (!isDbUserLoading && dbUser && !isDbUserError) {
      console.log('User found in DB. Redirecting to Home')
      navigate('/')
    } else if (!isAuth0Loading && !isAuthenticated) {
      console.log('User not found in DB. Redirecting to login')
      navigate('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDbUserLoading,
    isDbUserError,
    navigate,
    isAuth0Loading,
    isAuthenticated,
  ])

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = evt.target
    setNewUser({
      ...newUser,
      [id]: value,
    })

    newUser.gender != '' && newUser.class != ''
      ? setImage(true)
      : setImage(false)
  }

  const handleLeftClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = evt.target
    if (rightButton) setRightButton(false)
    if (newUser.class == 'mage') {
      setNewUser({
        ...newUser,
        [id]: 'rogue',
      })
    } else if (newUser.class == 'rogue') {
      setNewUser({
        ...newUser,
        [id]: 'warrior',
      })
      setLeftButton(true)
    }
  }

  const handleRightClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = evt.target
    if (leftButton) setLeftButton(false)
    if (newUser.class == 'warrior') {
      setNewUser({
        ...newUser,
        [id]: 'rogue',
      })
    } else if (newUser.class == 'rogue') {
      setNewUser({
        ...newUser,
        [id]: 'mage',
      })
      setRightButton(true)
    }
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    if (!auth0User?.sub) {
      console.error('Auth0 user ID not available. Cannot register.')
      return
    }

    const dataToSend: UserData = {
      ...newUser,
      auth_id: auth0User.sub,
    }

    try {
      const token = await getAccessTokenSilently()
      await addUserMutation.mutateAsync({ userData: dataToSend, token })
      console.log('New user registered successfully, redirecting to home.')
      navigate('/tutorial')
    } catch (error) {
      console.error('Failed to register new user:', error)
    }
  }

  if (isAuth0Loading || isDbUserLoading) {
    return (
      <section>
        <div>
          <div>
            <h1>Loading registration form...</h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl shadow-gray-950">
        <h2 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          Register
        </h2>
        <div className="justify-items-center">
          <form onSubmit={handleSubmit} className="mb-4 flex w-96 flex-col">
            {/* Name */}
            <label htmlFor="name" className="mb-2">
              Name:{' '}
            </label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={handleChange}
              className="mb-2 text-black"
              required
            />

            {/* Gender */}
            <label htmlFor="gender" className="mb-2">
              Gender:{' '}
            </label>
            <select
              id="gender"
              onChange={handleChange}
              className="mb-2 text-black"
            >
              <option value="" disabled selected>
                Select your option
              </option>
              <option value={'male'}>Male</option>
              <option value={'female'}>Female</option>
              <option value={'cat'}>Cat</option>
            </select>

            {/* Class and Image */}
            {isImage == true ? (
              <div>
                <label htmlFor="class">
                  <p>Choose your class ⚔️</p>
                  <p>Your current class: {newUser.class}</p>
                </label>
                <div className="flex flex-row">
                  <button
                    id="class"
                    type="button"
                    onClick={handleLeftClick}
                    disabled={leftButton}
                  >
                    {'<'}
                  </button>

                  <img
                    src={`/characters/${newUser.gender}${newUser.class}${newUser.appearance}${newUser.rank}.webp`}
                    alt="new character"
                    className="mb-2 h-96 w-auto"
                  />

                  <button
                    id="class"
                    type="button"
                    onClick={handleRightClick}
                    disabled={rightButton}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={addUserMutation.isPending}
              className="mb-4 cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                               transition duration-200 hover:bg-gray-600"
            >
              {addUserMutation.isPending ? 'Registering...' : 'Register'}
            </button>

            {/* Mutation Error Messages */}
            {addUserMutation.isError && (
              <p className="mt-2 text-red-500">
                Error: {addUserMutation.error?.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
