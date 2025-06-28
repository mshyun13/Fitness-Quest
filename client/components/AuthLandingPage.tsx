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
    isSuccess: isDbUserSuccess,
    isError: isDbUserError,
    error: dbUserError,
    mutate: addNewUserToDb,
  } = useUserByAuth0()

  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0User) {
      if (!isDbUserLoading) {
        if (dbUser) {
          // User exists in DB
          console.log('Existing user logged in, redirecting to home.')
          navigate('/')
        } else if (isDbUserSuccess && !dbUser) {
          // User does NOT exist in DB (first time login)
          console.log('New user, adding to DB and redirecting to register')

          addNewUserToDb({
            userData: {
              auth_id: auth0User.sub!,
              name: auth0User.name || 'New User',
              class: 'Bronze',
            },
          })
          navigate('/register')
        } else if (isDbUserError) {
          // Error check user in DB
          console.error('Error checking user in DB:', dbUserError)
          navigate('/')
        }
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      navigate('/login')
    }
  }, [
    isLoading,
    isAuthenticated,
    auth0User,
    dbUser,
    isDbUserLoading,
    isDbUserSuccess,
    isDbUserError,
    dbUserError,
    addNewUserToDb,
    navigate,
  ])

  return (
    <section className="hero is-fullheight is-info">
      <div className="hero-body">
        <div className="has-text-centered container">
          <h1 className="title has-text-white">Loading your profile...</h1>
          <progress
            className="progress is-small is-primary"
            max="100"
          ></progress>
        </div>
      </div>
    </section>
  )
}

export default AuthLandingPage
