import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const LoginPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('Authenticated user. Redirecting to /')
      navigate('/')
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  }

  if (isLoading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    )
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-mono text-green-300">
      <div className="w-full max-w-4xl text-center">
        {/* Title */}
        <h1 className="mb-8 text-6xl font-extrabold text-green-400 drop-shadow-lg">
          Fit Quest
        </h1>
        <div className="mx-auto my-4 max-w-md rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-2xl">
          {/* Login */}
          <div className="mb-4">
            <button
              className="w-full rounded bg-blue-600 px-6 py-3 text-xl font-bold text-white transition duration-200 hover:bg-blue-700"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          {/* Register */}
          <div>
            <button
              className="w-full rounded bg-red-600 px-6 py-3 text-xl font-bold text-white transition duration-200 hover:bg-red-700"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
