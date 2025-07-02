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

  // App.tsx conditional rendering
  useEffect(() => {
    if (isOnLandingPage) {
      document.body.style.overflow = 'hidden' // Hide scrollbars
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOnLandingPage])

  const headerClasses = `select-none bg-gray-900 p-4 font-mono text-green-300 ${
    location.pathname !== '/' ? 'border-b-2 border-green-700' : ''
  }`

  const mainClasses = `min-h-[87vh] text-center text-white pt-8 pb-20 ${
    !isOnLandingPage
    // ? 'bg-[url(/backgrounds/landingpage_bg_dark.png)] pt-8 pb-20'
    //:
    // ''
  }`

  return (
    <>
      <div className="fixed -z-10 h-screen w-screen bg-[url(/backgrounds/landingpage_bg_dark.png)] bg-cover pb-20 pt-8"></div>
      {protectedRoutes.includes(location.pathname) && (
        <header className={headerClasses}>
          <div className="flex max-w-max grid-cols-2 items-center justify-self-center ">
            <img src="/logo.webp" alt="logo" className="inline h-auto w-16" />
            <h1 className="inline pt-2 text-center font-['Real_Tatoem',_serif] text-4xl text-gray-200 sm:text-6xl">
              Fit Quest
            </h1>
          </div>
          <Nav />
        </header>
      )}
      <main className={mainClasses}>
        <Outlet />
      </main>
    </>
  )
}

export default App
