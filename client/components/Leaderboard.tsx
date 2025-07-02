import { useAuth0 } from '@auth0/auth0-react'
import { useLeaderboard } from '../hooks/useUsers.ts'

// For file name convention
const capFirstLetter = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function Leaderboard() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()

  const {
    data: leaderboard,
    isLoading: dbUserLoading,
    isError: dbUserError,
  } = useLeaderboard()

  if (auth0Loading || dbUserLoading) {
    return <p>Loading Leaderboard...</p>
  }

  if (dbUserError) {
    return <p>Error Loading Leaderboard</p>
  }

  if (!isAuthenticated) {
    return <p>Please log in to view Leaderboard</p>
  }

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 pb-12 pt-8 font-mono text-green-300 shadow-xl shadow-gray-950">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Leaderboard
        </h3>
        {leaderboard?.map((user, i) => {
          // For file name convention
          const capitalizedRank = capFirstLetter(user.rank)

          return (
            <>
              <h3
                key={user.id + 'h'}
                className={`mt-2 inline rounded-full p-2 text-2xl font-bold text-white shadow-md shadow-gray-950  ${i === 0 && ' bg-yellow-600 text-yellow-300 '} ${i === 1 && ' bg-slate-600 text-gray-400 '} ${i === 2 && ' bg-amber-950 text-amber-600 '}`}
              >
                #{i + 1}
              </h3>
              <div
                key={user.id}
                className="justify-content-center mb-4 mt-5 flex items-center gap-1 justify-self-center rounded-2xl border border-gray-600 bg-gray-700 p-2 shadow-xl shadow-gray-900 sm:gap-4 sm:p-4"
              >
                {' '}
                <img
                  src={`/characters/${user.gender}${user.class}1${capitalizedRank}.webp`} // Used here
                  alt="character"
                  className="h-auto w-20 sm:mx-auto sm:w-32 "
                />
                <div className="mx-auto grid grid-cols-[1fr_2fr] font-medium sm:gap-1 sm:text-xl">
                  <p>Name: </p>
                  <p className="text-center capitalize text-white">
                    {user?.name}
                  </p>
                  <p>Class: </p>
                  <p className="text-center capitalize text-white">
                    {user?.class}
                  </p>
                  <p>Rank: </p>
                  <p className="text-center capitalize text-white">
                    {user?.rank}
                  </p>
                  <p>Level: </p>
                  <p className="text-center text-white">{user?.level}</p>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default Leaderboard
