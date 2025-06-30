import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Nav() {
  const { isAuthenticated, logout } = useAuth0()
  const location = useLocation()

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  const isOnLoginPage = location.pathname === '/'

  return (
    <div className="flex flex-wrap justify-around sm:text-xl">
      {!isOnLoginPage && (
        <>
          <Link to={isAuthenticated ? '/home' : '/'}>Home</Link>
          <p>-</p>
        </>
      )}

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
