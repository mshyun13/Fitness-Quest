import { useAuth0 } from '@auth0/auth0-react'
import { useUserByAuth0 } from '../hooks/useUsers.ts'
import { useAchievementsById } from '../hooks/achievements.ts'
import { getXpNeededForNextLevel } from '../../server/utils/xpLogic.ts'
import { useEffect, useState } from 'react'
import AchievementsCard from './AchievementCard.tsx'

function Profile() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()
  //const mutateAch = useAchievementsById(1)
  const [showAchievement, setShowAchievement] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState({
    id: 0,
    title: '',
    description: '',
    reward: 0,
  })

  const {
    data: user,
    isLoading: dbUserLoading,
    isError: dbUserError,
    //update: dbuserUpdate,
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

  // function updateUser() {
  //   dbuserUpdate.mutate({ id: 1, rank: 'gold', level: 31, appearance: 3 })
  // }

  // function addAch() {
  //   mutateAch.add.mutate({
  //     id: 7,
  //     user_id: 1,
  //   })
  // }

  function showAchievementCard(a) {
    setSelectedAchievement(a)
    setShowAchievement(true)
  }

  return (
    <>
      {/* <button onClick={updateUser}>updateUser</button> */}
      {/* <button onClick={addAch}>updateAchievements</button> */}
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8  font-mono text-green-300 shadow-xl shadow-gray-950">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Profile
        </h3>
        <div className="justify-content-center mt-10 flex flex-wrap items-center gap-1.5 justify-self-center rounded-2xl p-4 sm:gap-4">
          <img
            src={`/characters/${user.gender}${user.class}${user.appearance}${user.rank}.webp`}
            alt="character"
            className="mx-auto h-auto w-48 sm:w-72 "
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
                className={`relative z-0 h-4 w-full translate-y-1 overflow-hidden rounded-md bg-gray-700 ring-1 ring-gray-950`}
              >
                <div
                  style={{
                    width: `${(user?.xp / xpNeededForNextLevel) * 100}%`,
                  }}
                  className={`z-10 h-4 overflow-hidden rounded-md bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {user?.xp + '/' + xpNeededForNextLevel || 0}
                </p>
              </div>
            </div>
            <p>Str:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 overflow-hidden rounded-md bg-gray-700 ring-1 ring-gray-950`}
              >
                <div
                  style={{ width: `${user?.str > 100 ? 100 : user?.str}%` }}
                  className={`z-10 h-4 rounded-md bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.str}
                </p>
              </div>
            </div>
            <p>Dex:</p>{' '}
            <div className="relative max-h-4">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 overflow-hidden rounded-md bg-gray-700 ring-1 ring-gray-950`}
              >
                <div
                  style={{ width: `${user?.dex > 100 ? 100 : user?.dex}%` }}
                  className={`z-10 h-4 overflow-hidden rounded-md bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.dex}
                </p>
              </div>
            </div>
            <p>Int:</p>{' '}
            <div className="relative ">
              <div
                className={`relative z-0 h-4 w-full translate-y-1 overflow-hidden rounded-md bg-gray-700 ring-1 ring-gray-950`}
              >
                <div
                  style={{ width: `${user?.int > 100 ? 100 : user?.int}%` }}
                  className={`z-10 h-4 rounded-md bg-green-700`}
                ></div>
                <p className="relative z-20 max-h-4 -translate-y-5 text-center text-white">
                  {'LVL ' + user?.int}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8 font-mono text-green-300 shadow-xl shadow-gray-950">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Achievements
        </h3>
        {userAchievements?.length !== 0 ? (
          <div className="mt-10 grid grid-cols-3 items-center justify-start gap-8 justify-self-center rounded-2xl p-4 ring-2 ring-gray-400 sm:grid-cols-6">
            {userAchievements?.map((a) => {
              return (
                <button key={a.id} onClick={() => showAchievementCard(a)}>
                  <p className="min-h-32 text-xs">
                    <img
                      src={`/achievements/achievement${a.id}.webp`}
                      alt={a.title}
                      className="h-auto w-20 rounded-xl"
                    />
                    {a.title}
                  </p>
                </button>
              )
            })}
          </div>
        ) : (
          <p>No achievements yet, Get started!</p>
        )}
      </div>

      {showAchievement && (
        <AchievementsCard
          onClose={() => setShowAchievement(false)}
          achievement={selectedAchievement}
        />
      )}
    </>
  )
}

export default Profile

// const mutateUser = useUsers()
// mutateUser.update.mutate({ id: 1, xp: 0, level: 1, str: 0, dex: 0, int: 0 })

// function updateUser() {
//   mutateUser.update.mutate({ id: 2, xp: 0, level: 1, str: 0, dex: 0, int: 0 })
// }

// <button onClick={updateUser}>updateUser</button>

// import { useUsers, useUser } from '../hooks/useUsers.ts'
// const { data: allUsers } = useUsers()
// const { data: user } = useUser({ id: 1 })
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
