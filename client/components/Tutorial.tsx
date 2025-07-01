import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

function Tutorial() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()
  const [showChallenge, setShowChallenge] = useState(false)

  const handleChallengeClick = () => {
    setShowChallenge(true)
  }

  const handleClose = () => {
    setShowChallenge(false)
  }

  const handleComplete = () => {
    alert(
      'Challenge completed! You can view all the completed challenges on the Profile page.',
    )
    setShowChallenge(false)
  }

  if (auth0Loading) {
    return <p>Loading tutorial</p>
  }

  if (!isAuthenticated) {
    return <p>Please log for the tutorial</p>
  }

  return (
    <>
      <h1 className="mb-6 text-5xl font-bold text-green-400">Tutorial</h1>
      <p>Click the challenge to view details of challenge.</p>
      <p>Increase your XP and level up by completing the challenges.</p>

      {/* Profile */}

      {/* Challenge */}
      <div className="mx-auto my-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
          Daily Challenges
        </h2>
        <ul className="space-y-4">
          <li
            onClick={handleChallengeClick}
            className="cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                        transition duration-200 hover:bg-gray-600"
          >
            <p className="mb-1 text-xl font-bold text-green-200">
              Pushin Through
            </p>
            <p className="text-lg text-gray-300">STR</p>
            <p className="text-lg text-gray-300">Easy</p>
          </li>
        </ul>
      </div>

      {/* Challenge Details */}
      {showChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 font-mono">
          <div className="relative mx-4 w-full max-w-lg rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-2xl">
            <p className="text-white">
              (This will shows the description and amount of xp of the chosen
              challenge)
            </p>
            <br />
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-400 transition duration-200 hover:text-green-400"
            >
              x
            </button>
            <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-3xl font-bold text-green-400">
              Pushin Through
            </h2>
            <div className="space-y-3 text-green-300">
              <p className="text-xl">
                <strong className="text-green-200">Attribute: STR</strong>
              </p>
              <p className="text-xl">
                <strong className="text-green-200">Difficulty: Easy</strong>
              </p>
              <p className="text-lg">
                <strong className="text-green-200">
                  Description: 10 pushups
                </strong>
              </p>
              <p className="text-xl">
                <strong className="text-green-200">XP Reward: 2500 XP</strong>
              </p>
              <div className="mt-6 text-center">
                <p className="text-white">
                  (Click the button to mark the challenge as completed)
                </p>
                <br />
                <button
                  onClick={handleComplete}
                  className="rounded bg-blue-600 px-6 py-2 font-bold text-white transition duration-200 hover:bg-blue-700"
                >
                  Complete Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tutorial
