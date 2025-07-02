import { useState, useEffect } from 'react'
import { useChallenges } from '../hooks/useChallenges'
import ChallengesModal from './ChallengesModal'
import { Challenge } from '../../models/challenge'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserByAuth0 } from '../hooks/useUsers'
import ManualEntryForm from './ManualEntryForm'
import {
  getXpNeededForNextLevel,
  getXpForLeveling,
} from '../../server/utils/xpLogic'

type NotificationType = 'success' | 'error' | 'info'

interface AppNotification {
  message: string
  type: NotificationType
}

function Home() {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
  } = useAuth0()

  const { data: challenges, isLoading, isError } = useChallenges()

  const {
    data: dbUser,
    isLoading: dbUserLoading,
    isError: dbUserError,
    refetch: refetchDbUser,
  } = useUserByAuth0()

  const [showModal, setShowModal] = useState(false)
  const [showSideQuest, setShowSideQuest] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  )

  // Notification for completing challenge and leveling up
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
      if (appNotification.message != 'Congratulations! You leveled up!') {
        new Audio('/audio/fitness.wav').play()
      } else if (
        appNotification.message === 'Congratulations! You leveled up!'
      ) {
        new Audio('/audio/fitness2.wav').play()
      }
      const timer = setTimeout(() => {
        setAppNotificationState(null)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [appNotification])

  // Selecting a challenge
  const handleCardClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowModal(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedChallenge(null)
  }

  // Show a Side Quest entry form
  const handleSideQuest = () => {
    setShowSideQuest(true)
  }

  if (isLoading || dbUserLoading || auth0Loading) {
    return <p>Loading Quests...</p>
  }

  if (isError || dbUserError) {
    return <p>Error Loading Quests</p>
  }

  if (!isAuthenticated && !auth0Loading) {
    return <p>Please log in to view Quests</p>
  }

  // Notification CSS
  const notificationClass =
    appNotification?.type === 'success'
      ? 'bg-green-600'
      : appNotification?.type === 'error'
        ? 'bg-red-600'
        : 'bg-blue-600' // info notification color

  const xpNeededForNextLevel = getXpNeededForNextLevel(
    dbUser ? dbUser.level : 0,
  )

  return (
    <section className="flex flex-col items-center justify-start font-mono text-green-300">
      {appNotification && (
        <div className="absolute z-50 min-h-40 w-screen justify-items-center">
          <div
            className={` mx-auto mb-4 justify-self-center rounded p-3 text-xl text-white shadow-xl shadow-gray-950 ${notificationClass}`}
            style={{ maxWidth: 'fit-content' }}
          >
            <p>{appNotification.message}</p>
          </div>
        </div>
      )}
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          {/* Notification */}

          <h1 className="z-10 mb-6 text-5xl font-bold text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
            Welcome,{' '}
            {isAuthenticated
              ? dbUser?.name || auth0User?.name || auth0User?.nickname || 'User'
              : dbUser?.name || 'User'}
          </h1>

          {dbUser && (
            <div className="mx-auto my-8 max-w-md rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-xl shadow-gray-950">
              <div className="flex">
                <img
                  src={`/characters/${dbUser.gender}${dbUser.class}${dbUser.appearance}${dbUser.rank}.webp`}
                  alt="character"
                  className="ml-4 h-auto w-32"
                />
                <div className="mx-auto self-center">
                  <p className="text-xl text-green-200">
                    Level:{' '}
                    <strong className="text-green-500">{dbUser.level}</strong>
                  </p>
                  <p className="text-xl text-green-200">
                    XP:{' '}
                    <strong className="text-green-500">
                      {dbUser.xp + '/' + xpNeededForNextLevel}
                    </strong>
                  </p>
                  <p className="text-xl text-green-200">
                    Rank:{' '}
                    <strong className="uppercase text-green-500">
                      {dbUser.rank}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {showSideQuest ? (
            ''
          ) : (
            <button
              className="rounded-lg bg-gray-700 p-2 text-xl font-bold text-green-400 shadow-xl shadow-gray-950 ring-1 ring-gray-400 hover:bg-gray-500"
              onClick={handleSideQuest}
            >
              Enter Side Quest
            </button>
          )}

          <div className="mx-auto my-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl shadow-gray-950">
            <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              Daily Quests
            </h2>
            <ul className="space-y-4">
              {challenges && challenges.length > 0 ? (
                challenges.slice(0, 3).map((challenge) => (
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
                      <strong className="text-green-100"></strong>{' '}
                      {challenge.attribute.toUpperCase()}
                    </p>
                    <p className="text-lg text-gray-300">
                      <strong className="text-green-100"></strong>{' '}
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
      {showModal && selectedChallenge && dbUser && (
        <ChallengesModal
          challenge={selectedChallenge}
          onClose={handleCloseModal}
          // currentUserId={dbUser.id}
          setAppNotification={setAppNotification}
        />
      )}

      {/* Side Quest */}
      {showSideQuest && dbUser && (
        <ManualEntryForm
          onClose={() => setShowSideQuest(false)}
          setAppNotification={setAppNotification}
          onUserUpdate={refetchDbUser}
          userId={dbUser.id}
        />
      )}
    </section>
  )
}

export default Home
