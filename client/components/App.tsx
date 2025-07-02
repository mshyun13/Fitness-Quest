import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Nav from './Nav.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

function App() {
  const { isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isOnLandingPage = location.pathname === '/'

  // Protected routes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const protectedRoutes = [
    '/home',
    '/profile',
    '/register',
    '/log',
    '/feed',
    '/leaderboard',
    '/tutorial',
  ]
  useEffect(() => {
    // Run if Auth0 has finished loading
    if (!isLoading) {
      // If the user isn't authenticated
      if (!isAuthenticated) {
        // and if the user is trying to access a protected route
        if (
          protectedRoutes.includes(location.pathname) && // and it's not LoginPage
          location.pathname !== '/auth-landing' && // and it's not AuthLandingPage
          location.pathname !== '/register' // and it's not Register
        ) {
          console.log('Register to gain access! Redirecting to LoginPage')
          navigate('/') // Redirect to LoginPage
        }
      }
      // Else, if the user is authenticated
      else {
        const fromAuthRedirect = location.state?.fromAuthRedirect
        if (location.pathname === '/' && !fromAuthRedirect) {
          console.log('Authenticated! Redirecting to home')
          navigate('/home') // Redirect to Home
        }
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    location.pathname,
    navigate,
    location.state,
    protectedRoutes,
  ])

  const headerClasses = `select-none bg-gray-900 p-4 font-mono text-green-300 ${
    location.pathname !== '/' ? 'border-b-2 border-green-700' : ''
  }`

  return (
    <>
      {protectedRoutes.includes(location.pathname) && (
        <header className={headerClasses}>
          <h1 className="pt-2 text-center font-['Real_Tatoem',_serif] text-6xl text-gray-200">
            Fit Quest
          </h1>
          <Nav />
        </header>
      )}
      <main className="min-h-[87vh] bg-[url(/backgrounds/landingpage_bg_dark.png)] pb-20 pt-8 text-center text-white">
        <Outlet />
      </main>
    </>
  )
}

export default App
