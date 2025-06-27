import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'

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
  const navigate = useNavigate()

  const { name: newName, class: newClass } = newUser

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evt.target
    setNewUser({
      ...newUser,
      [id]: value,
    })
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    const token = getAccessTokenSilently()
    evt.preventDefault
    //getUser matching with Auth0 id
    navigate('/')
  }

  console.log(newUser)

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input type="text" id="name" value={newName} onChange={handleChange} />
        <label>Preferred Class: </label>
        <input
          type="text"
          id="class"
          value={newClass}
          onChange={handleChange}
        />
      </form>
    </>
  )
}

export default Register
