import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Challenge {
  title: string
  attribute: string
  difficulty: string
  description: string
  xp_rewards: number
}

const challenges = [
  {
    title: 'meow MEOW!!! 🦮',
    attribute: 'Str',
    difficulty: 'Medium',
    description: 'meow Meow MEOW!!! (Translation: Beat the dog next door)',
    xp_rewards: 1500,
  },
  {
    title: 'Meow! 👟',
    attribute: 'Dex',
    difficulty: 'Easy',
    description: 'Meow meow meow Meow! (Translation: Parkour in the kitchen)',
    xp_rewards: 1000,
  },
  {
    title: '...meow 💩',
    attribute: 'Int',
    difficulty: 'Hard',
    description:
      'meow... meow meow... (Translation: Find the perfect spot to poop)',
    xp_rewards: 2500,
  },
]

const profile = {
  name: 'Meow',
  class: 'Meow Meow',
  rank: 'MEEEOOOOOW',
  level: 0,
  xp: 0,
  str: 0,
  dex: 0,
  int: 0,
  appearance: 'Bronze',
}

const totalXp = 1500

function Tutorial() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState({
    title: '',
    attribute: '',
    difficulty: '',
    description: '',
    xp_rewards: 0,
  })
  const navigate = useNavigate()

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowChallenge(true)
  }

  const handleClose = () => {
    setShowChallenge(false)
  }

  const handleComplete = () => {
    // alert(
    //   'Challenge completed! You can view all the completed challenges on the Profile page.',
    // )
    profile.xp += selectedChallenge.xp_rewards
    setShowChallenge(false)
  }

  const handleFinish = () => {
    navigate('/home')
  }

  if (profile.xp >= totalXp) {
    const levelIncrease = Math.trunc(profile.xp / totalXp)
    profile.level += levelIncrease
    const xpReminder = profile.xp % totalXp
    profile.xp = xpReminder
    if (selectedChallenge.attribute == 'Str') {
      profile.str += levelIncrease
    } else if (selectedChallenge.attribute == 'Dex') {
      profile.dex += levelIncrease
    } else profile.int += levelIncrease
  }

  if (profile.level >= 3 && profile.level < 6) {
    profile.appearance = 'Silver'
  } else if (profile.level >= 6 && profile.level < 9) {
    profile.appearance = 'Gold'
  } else if (profile.level >= 9 && profile.level < 12) {
    profile.appearance = 'Platinum'
  } else if (profile.level >= 12) {
    profile.appearance = 'Diamond'
  }

  if (auth0Loading) {
    return <p>Loading tutorial</p>
  }

  if (!isAuthenticated) {
    return <p>Please log for the tutorial</p>
  }

  return (
    <div>
      <h1 className="z-10 mb-6 font-mono text-5xl font-bold text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
        Tutorial
      </h1>
      <div className="justify-self-center rounded-lg bg-zinc-700 bg-opacity-40 p-4 font-mono backdrop-blur-sm">
        <p>Welcome to the Fit Quest tutorial!</p>
        <p>
          Thank you for the registration, and now you are a member of our Fit
          Quest.
        </p>
        <p>
          You will be able to view your profile details on the Profile page.
        </p>
        <p>It will shows your name, class, levels and progress on XP.</p>
        <br />
        <p>{"Please find Meow's profile below as an example."}</p>
      </div>
      <br />
      {/* Profile */}
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl shadow-gray-950">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Profile
        </h3>
        <div className="justify-content-center mt-10 flex flex-wrap items-center gap-1.5 justify-self-center rounded-2xl p-4 sm:gap-4">
          <img
            src={`characters/catrogue1${profile.appearance}.webp`}
            alt="tutorial profile character"
            className="mx-auto h-auto w-48 sm:w-72"
          />
          <div className="mx-auto grid grid-cols-[1fr_2fr] gap-1 font-semibold">
            <p>Name: </p>
            <p className="text-center capitalize text-white">{profile.name}</p>
            <p>Class: </p>
            <p className="text-center capitalize text-white">{profile.class}</p>
            <p>Rank: </p>
            <p className="text-center capitalize text-white">{profile.rank}</p>
            <p>Level: </p>
            <p className="text-center text-white">{profile.level}</p>
            <p>XP: </p>
            <div className="relative max-h-4">
              <div className="relative z-0 h-4 w-full translate-y-1 rounded-md bg-gray-700 ring-1 ring-gray-950">
                <div
                  style={{
                    width: `${(profile.xp / totalXp) * 100}%`,
                  }}
                  className="z-10 h-4 overflow-hidden rounded-md bg-green-700"
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {profile.xp}/{totalXp}
                </p>
              </div>
            </div>
            <p>Str: </p>
            <div className="relative max-h-4">
              <div className="relative z-0 h-4 w-full translate-y-1 rounded-md bg-gray-700 ring-1 ring-gray-950">
                <div
                  style={{ width: `${profile.str}%` }}
                  className="z-10 h-4 rounded-md bg-green-700"
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  LVL {profile.str}
                </p>
              </div>
            </div>
            <p>Dex: </p>
            <div className="relative max-h-4">
              <div className="relative z-0 h-4 w-full translate-y-1 rounded-md bg-gray-700 ring-1 ring-gray-950">
                <div
                  style={{ width: `${profile.dex}%` }}
                  className="z-10 h-4 rounded-md bg-green-700"
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  LVL {profile.dex}
                </p>
              </div>
            </div>
            <p>Int: </p>
            <div className="relative max-h-4">
              <div className="relative z-0 h-4 w-full translate-y-1 rounded-md bg-gray-700 ring-1 ring-gray-950">
                <div
                  style={{ width: `${profile.int}%` }}
                  className="z-10 h-4 rounded-md bg-green-700"
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  LVL {profile.int}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <br />
      <div className="justify-self-center rounded-lg bg-zinc-700 bg-opacity-40 p-4 font-mono backdrop-blur-sm">
        <p>Click the challenge to view details of challenge.</p>
        <p>{"Increase Meow's XP and level up by completing the challenges."}</p>
        <p>
          You can view all the completed challenges on the Activity Log page.
        </p>
      </div>
      <div className="mx-auto my-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl shadow-gray-950">
        <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
          Daily Challenges
        </h2>
        <ul className="space-y-4">
          {challenges.map((challenge, index) => (
            <li
              key={index}
              id={profile.class}
              onClick={() => handleChallengeClick(challenge)}
              className="cursor-pointer rounded border border-gray-600 bg-gray-700 p-4 shadow
                        transition duration-200 hover:bg-gray-600"
            >
              <p className="mb-1 text-xl font-bold text-green-200">
                {challenge.title}
              </p>
              <p className="text-lg text-gray-300">{challenge.attribute}</p>
              <p className="text-lg text-gray-300">{challenge.difficulty}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="justify-self-center rounded-lg bg-zinc-700 bg-opacity-40 p-4 font-mono backdrop-blur-sm">
        <p>🎉 Congratulation 🎉</p>
        <p>Now you have completed the basic tutorial for Fit Quest.</p>
        <br />
        <p>Please click button below to start the game!</p>
      </div>

      <div>
        <button
          onClick={handleFinish}
          className="mb-24 mt-8 rounded bg-blue-600 px-6 py-2 font-bold text-white transition duration-200 hover:bg-blue-700"
        >
          Finish Tutorial
        </button>
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
              {selectedChallenge.title}
            </h2>
            <div className="space-y-3 text-green-300">
              <p className="text-xl">
                <strong className="text-green-200">
                  Attribute: {selectedChallenge.attribute}
                </strong>
              </p>
              <p className="text-xl">
                <strong className="text-green-200">
                  Difficulty: {selectedChallenge.difficulty}
                </strong>
              </p>
              <p className="text-lg">
                <strong className="text-green-200">
                  Description: {selectedChallenge.description}
                </strong>
              </p>
              <p className="text-xl">
                <strong className="text-green-200">
                  XP Reward: {selectedChallenge.xp_rewards} XP
                </strong>
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
    </div>
  )
}

export default Tutorial
