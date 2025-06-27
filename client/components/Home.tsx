import { useState, useEffect } from 'react'
import { useChallenges } from '../hooks/useChallenges'
import ChallengesModal from './ChallengesModal'
import { Challenge } from '../../models/challenge'
import { useUser } from '../hooks/useUsers'
// import { useAuth0 } from '@auth0/auth0-react'

type NotificationType = 'success' | 'error' | 'info'

interface AppNotification {
  message: string
  type: NotificationType
}

function Home() {
  //  const {
  //     user: auth0User,
  //     isAuthenticated,
  //     isLoading: auth0Loading,
  //     loginWithRedirect,
  //     logout,
  //   } = useAuth0()

  const { data: challenges, isLoading, isError } = useChallenges()

  // ---------- //
  const currentUserId = 1
  const {
    data: dbUser,
    isLoading: dbUserLoading,
    isError: dbUserError,
  } = useUser({ id: currentUserId })
  // ---------- //

  const [showModal, setShowModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  )

  const [appNotification, setAppNotificationState] =
    useState<AppNotification | null>(null)

  // Function to set and auto-clear notifications
  const setAppNotification = (
    message: string,
    type: NotificationType = 'info',
  ) => {
    setAppNotificationState({ message, type })
  }

  // Clear notifications
  useEffect(() => {
    if (appNotification) {
      const timer = setTimeout(() => {
        setAppNotificationState(null)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [appNotification])

  const handleCardClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedChallenge(null)
  }

  if (isLoading || dbUserLoading /*|| auth0Loading*/) {
    return <p>Loading Challenges...</p>
  }

  if (isError || dbUserError) {
    return <p>Error Loading Challenges</p>
  }

  // Notification CSS
  const notificationClass =
    appNotification?.type === 'success'
      ? 'bg-green-600'
      : appNotification?.type === 'error'
        ? 'bg-red-600'
        : 'bg-blue-600'

  return (
    <section className="flex min-h-screen flex-col items-center justify-start bg-gray-900 p-4 pt-16 font-mono text-green-300">
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          {/* Notification */}
          {appNotification && (
            <div
              className={`mx-auto mb-4 rounded p-3 text-white ${notificationClass}`}
              style={{ maxWidth: 'fit-content' }}
            >
              <p>{appNotification.message}</p>
            </div>
          )}

          <h1 className="mb-6 text-5xl font-bold text-green-400">
            Welcome,{' '}
            {
              /*isAuthenticated ? (auth0User?.name || auth0User?.nickname || 'User') :*/ dbUser?.name ||
                'User'
            }
          </h1>

          {dbUser && (
            <div className="mx-auto my-4 max-w-md rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-xl">
              <p className="text-xl text-green-200">
                Level:{' '}
                <strong className="text-green-500">{dbUser.level}</strong>
              </p>
              <p className="text-xl text-green-200">
                XP: <strong className="text-green-500">{dbUser.xp}</strong>
              </p>
              <p className="text-xl text-green-200">
                Rank: <strong className="text-green-500">{dbUser.rank}</strong>
              </p>
            </div>
          )}

          <div className="mx-auto my-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              Daily Challenges
            </h2>
            <ul className="space-y-4">
              {challenges && challenges.length > 0 ? (
                challenges.map((challenge) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                  <li
                    key={challenge.id}
                    onClick={() => handleCardClick(challenge)}
                    className="cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                               transition duration-200 hover:bg-gray-600"
                  >
                    <p className="mb-1 text-xl font-bold text-green-200">
                      {challenge.title}
                    </p>
                    <p className="text-lg text-gray-300">
                      <strong className="text-green-100">Attribute:</strong>{' '}
                      {challenge.attribute.toUpperCase()}
                    </p>
                    <p className="text-lg text-gray-300">
                      <strong className="text-green-100">Difficulty:</strong>{' '}
                      {challenge.difficulty.charAt(0).toUpperCase() +
                        challenge.difficulty.slice(1)}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No challenges available
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Conditional Render */}
      {showModal && selectedChallenge && (
        <ChallengesModal
          challenge={selectedChallenge}
          onClose={handleCloseModal}
          currentUserId={currentUserId}
          setAppNotification={setAppNotification}
        />
      )}
    </section>
  )
}

export default Home
