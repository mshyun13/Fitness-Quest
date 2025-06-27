import { useAchievements } from '../hooks/achievements.ts'
import { useUsers, useUser } from '../hooks/useUsers.ts'

function Profile() {
  const { data: allUsers } = useUsers()
  const { data: user } = useUser({ id: 1 })
  const mutateUser = useUsers()
  const { data: allAchievements } = useAchievements()

  console.log('comp', allAchievements)

  // mutateUser.add.mutate({
  //   auth_id: 'abcd',
  //   name: 'test',
  //   class: 'warrior',
  // })

  // function updateUser() {
  //   mutateUser.update.mutate({ id: 5, xp: 100, int: 3, dex: 20 })
  // }

  // <button onClick={updateUser}>updateUser</button>

  // console.log('component', user)
  // console.log('component all users', allUsers)

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
              <p className="absolute z-20 m-0 ml-10 text-white">{user?.xp}</p>
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.xp}%` }}
                  // work out based on next level xp
                  className={`z-10 h-4 bg-green-700`}
                ></div>
              </div>
            </div>
            <p>Str:</p>{' '}
            <div className="relative max-h-4">
              <p className="absolute z-20 m-0 ml-10 text-white">{user?.str}</p>
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.str}%` }}
                  className={`z-10  h-4 bg-green-700`}
                ></div>
              </div>
            </div>
            <p>Dex:</p>{' '}
            <div className="relative max-h-4">
              <p className="absolute z-20 m-0 ml-10 text-white">{user?.dex}</p>
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.dex}%` }}
                  className={`z-10 h-4 bg-green-700`}
                ></div>
              </div>
            </div>
            <p>Int:</p>{' '}
            <div className="relative max-h-4">
              <p className="absolute z-20 m-0 ml-10 text-white">{user?.int}</p>
              <div
                className={`relative z-0 h-4 w-full translate-y-1 bg-gray-700`}
              >
                <div
                  style={{ width: `${user?.int}%` }}
                  className={`z-10 h-4 bg-green-700`}
                ></div>
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
        {/* <div className="mt-10 flex flex-wrap items-center justify-start gap-8 justify-self-center rounded-2xl p-4 ring-2 ring-gray-300"> */}
        <div className="mt-10 grid grid-cols-3 items-center justify-start gap-8 justify-self-center rounded-2xl p-4 ring-2 ring-gray-300 sm:grid-cols-6">
          <p className="text-sm">
            <img
              src={`/achievements/achievement${allAchievements[0]?.id}.webp`}
              alt="character"
              className="h-auto w-20"
            />
            {allAchievements[0]?.title}
          </p>
          <img
            src="/achievement.webp"
            alt="character"
            className="h-auto w-20"
          />
          <img
            src="/achievement.webp"
            alt="character"
            className="h-auto w-20"
          />
          <img
            src="/achievement.webp"
            alt="character"
            className="h-auto w-20"
          />
          <img
            src="/achievement.webp"
            alt="character"
            className="h-auto w-20"
          />
        </div>
      </div>
    </>
  )
}

export default Profile
