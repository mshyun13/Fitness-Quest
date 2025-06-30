import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Nav() {
  const { isAuthenticated, logout } = useAuth0()

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return (
    <div className="flex flex-wrap justify-around sm:text-xl">
      <Link to={isAuthenticated ? '/home' : '/'}>Home</Link>
      <p>-</p>
      {isAuthenticated && (
        <>
          <Link to="/profile">Profile</Link>
          <p>-</p>
        </>
      )}
      {isAuthenticated && (
        <>
          <Link to="/log">Activity Log</Link>
          <p>-</p>
        </>
      )}
      {isAuthenticated && (
        <button
          onClick={handleSignOut}
          className="cursor-pointer border-none bg-transparent text-green-300 hover:text-green-200"
        >
          Log Out
        </button>
      )}
    </div>
  )
}
