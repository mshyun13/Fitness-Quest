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

  // eslint-disable-next-line prefer-const
  let mql = window.matchMedia('(max-width: 999px)')

  console.log(mql.matches)

  const isOnLoginPage = location.pathname === '/'

  if (!mql.matches) {
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
          <>
            <Link to="/feed">Feed</Link>
            <p>-</p>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/leaderboard">Leaderboard</Link>
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

  if (mql.matches) {
    return (
      <div className="fixed bottom-0 left-0 flex h-14 w-screen flex-wrap items-center justify-around bg-gray-900 sm:text-xl">
        {!isOnLoginPage && (
          <>
            <Link to={isAuthenticated ? '/home' : '/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-castle-icon lucide-castle justify-self-center"
              >
                <path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
                <path d="M18 11V4H6v7" />
                <path d="M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4" />
                <path d="M22 11V9" />
                <path d="M2 11V9" />
                <path d="M6 4V2" />
                <path d="M18 4V2" />
                <path d="M10 4V2" />
                <path d="M14 4V2" />
              </svg>
              <p className="text-center text-[0.7rem]">Home</p>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-icon lucide-user justify-self-center"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <p className="text-center text-[0.7rem]">Profile</p>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/log">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-scroll-text-icon lucide-scroll-text justify-self-center"
              >
                <path d="M15 12h-5" />
                <path d="M15 8h-5" />
                <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
              </svg>
              <p className="text-center text-[0.7rem]">Log</p>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/feed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-square-text-icon lucide-message-square-text justify-self-center"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M13 8H7" />
                <path d="M17 12H7" />
              </svg>
              <p className="text-center text-[0.7rem]">Feed</p>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/leaderboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-crown-icon lucide-crown justify-self-center"
              >
                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                <path d="M5 21h14" />
              </svg>
              <p className="text-center text-[0.7rem]">Leaders</p>
            </Link>
          </>
        )}
        {isAuthenticated && (
          <button
            onClick={handleSignOut}
            className="cursor-pointer border-none bg-transparent text-green-300 hover:text-green-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out-icon lucide-log-out justify-self-center"
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
            <p className="text-center text-[0.7rem]">Sign Out</p>
          </button>
        )}
      </div>
    )
  }
}
