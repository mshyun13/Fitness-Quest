import { useAuth0 } from '@auth0/auth0-react'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'

export default function LoginButton() {
  const { user, logout, loginWithRedirect } = useAuth0()

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <>
      <IfAuthenticated>
        <button onClick={handleSignOut}>Sign Out</button>
        {/* {user && <p>Welcome {user.name}</p>} */}
      </IfAuthenticated>
      <IfNotAuthenticated>
        <button onClick={handleSignIn}>Sign In</button>
      </IfNotAuthenticated>
    </>
  )
}
