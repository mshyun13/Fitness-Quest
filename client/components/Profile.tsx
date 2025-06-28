import { useAuth0 } from '@auth0/auth0-react'
import { useUserByAuth0 } from '../hooks/useUsers.ts'
import { useAchievementsById } from '../hooks/achievements.ts'
import { getXpNeededForNextLevel } from '../../server/utils/xpLogic.ts'
import { AchievementsData } from '../../models/achievements.ts'
import { useEffect } from 'react'

function Profile() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()

  const {
    data: user,
    isLoading: dbUserLoading,
    isError: dbUserError,
  } = useUserByAuth0()

  const { data: userAchievements, refetch } = useAchievementsById(user?.id || 0)

  useEffect(() => {
    refetch()
    return () => {
      userAchievements
    }
  }, [refetch, user, userAchievements])

  if (auth0Loading || dbUserLoading) {
    return <p>Loading Profile...</p>
  }

  if (dbUserError) {
    return <p>Error Loading Profile</p>
  }

  if (!isAuthenticated) {
    return <p>Please log in to view your Profile</p>
  }

  if (!user) {
    return <p>Profile not found</p>
  }

  const xpNeededForNextLevel = getXpNeededForNextLevel(user?.level)

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Profile
        </h3>
        <div className="justify-content-center mt-10 flex flex-wrap items-center gap-1.5 justify-self-center rounded-2xl p-4 ring-2 ring-gray-300 sm:gap-4">
          <img
            src="/warrior.webp"
            alt="character"
            className="mx-auto h-auto w-40"
          />
          <div className="mx-auto grid grid-cols-[1fr_2fr] gap-1 font-semibold">
            <p>Name: </p>
            <p className="text-center capitalize text-white">{user?.name}</p>
            <p>Class: </p>
            <p className="text-center capitalize text-white">{user?.class}</p>
            <p>Rank: </p>
            <p className="text-center capitalize text-white">{user?.rank}</p>
            <p>Level: </p>
            <p className="text-center text-white">{user?.level}</p>
            <p>XP:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{
                    width: `${(user?.xp / xpNeededForNextLevel) * 100}%`,
                  }}
                  className={`z-10 h-4 overflow-hidden bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {user?.xp + '/' + xpNeededForNextLevel || 0}
                </p>
              </div>
            </div>
            <p>Str:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.str > 100 ? 100 : user?.str}%` }}
                  className={`z-10  h-4 bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.str}
                </p>
              </div>
            </div>
            <p>Dex:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.dex > 100 ? 100 : user?.dex}%` }}
                  className={`z-10 h-4 overflow-hidden bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.dex}
                </p>
              </div>
            </div>
            <p>Int:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.int > 100 ? 100 : user?.int}%` }}
                  className={`z-10 h-4 overflow-hidden bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.int}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Achievements
        </h3>
        {userAchievements ? (
          <div className="mt-10 grid grid-cols-3 items-center justify-start gap-8 justify-self-center rounded-2xl p-4 ring-2 ring-gray-300 sm:grid-cols-6">
            {userAchievements.map((a: AchievementsData) => {
              return (
                <p key={a.id} className="text-xs">
                  <img
                    src={`/achievements/achievement${a.id}.webp`}
                    alt={a.title}
                    className="h-auto w-20"
                  />
                  {a.title}
                </p>
              )
            })}
          </div>
        ) : (
          <p>No achievements</p>
        )}
      </div>
    </>
  )
}

export default Profile

// import { useUsers, useUser } from '../hooks/useUsers.ts'
// const { data: allUsers } = useUsers()
// const { data: user } = useUser({ id: 2 })
// const mutateUser = useUsers()
// const { data: allAchievements } = useAchievements()
// const { data: userAchievements } = useAchievementsById(2)

// const mutateAch = useAchievementsById(2)

// function addAch() {
//   mutateAch.add.mutate({
//     id: 2,
//     user_id: 2,
//   })
// }

// mutateUser.add.mutate({
//   auth_id: 'abcd',
//   name: 'test',
//   class: 'warrior',
// })

// function updateUser() {
//   mutateUser.update.mutate({ id: 2, xp: 0, level: 1, str: 0, dex: 0, int: 0 })
// }

// <button onClick={updateUser}>updateUser</button>
