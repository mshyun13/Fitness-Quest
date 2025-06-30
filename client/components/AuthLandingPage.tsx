import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserByAuth0 } from '../hooks/useUsers.ts'

const AuthLandingPage = () => {
  const { isAuthenticated, isLoading, user: auth0User } = useAuth0()
  const navigate = useNavigate()

  const {
    data: dbUser,
    isLoading: isDbUserLoading,
    isError: isDbUserError,
    error: dbUserError,
  } = useUserByAuth0()

  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0User) {
      if (!isDbUserLoading) {
        if (dbUser) {
          // User exists in DB
          console.log('Existing user logged in, redirecting to home.')
          navigate('/home')
        } else if (isDbUserError && (dbUserError as any)?.status === 404) {
          // User does NOT exist in DB (first time login)
          console.log('New user, adding to DB and redirecting to register')
          navigate('/register')
        } else if (isDbUserError) {
          // Error check user in DB
          console.error('Error checking user in DB:', dbUserError)
          navigate('/')
        }
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      navigate('/')
    }
  }, [
    isLoading,
    isAuthenticated,
    auth0User,
    dbUser,
    isDbUserLoading,
    isDbUserError,
    dbUserError,
    navigate,
  ])

  return (
    <section>
      <div>
        <div>
          <h1>Loading your profile...</h1>
        </div>
      </div>
    </section>
  )
}

export default AuthLandingPage
