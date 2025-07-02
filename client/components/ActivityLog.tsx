import { useEffect, useState } from 'react'
import { useCompletions } from '../hooks/useCompletions.ts'
import { useSideQuests } from '../hooks/useSideQuests.ts'
import { useUserByAuth0 } from '../hooks/useUsers.ts'

function ActivityLog() {
  const { completions, loading, error } = useCompletions()
  const { data: user } = useUserByAuth0()
  const { data: sideQuests, refetch } = useSideQuests(user?.id || 0)
  const [showLog, setShowLog] = useState('challenge')

  useEffect(() => {
    refetch()
    //invalidate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (loading) {
    return <p>Loading your activity log...</p>
  }

  if (error) {
    return <p>Error loading bro! {error}</p>
  }

  // if (completions.length === 0) {
  //   return <p>No challenges completed yet. Get started!</p>
  // }

  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-row items-center justify-center gap-10 rounded font-mono text-xl text-white">
        <button
          className={`rounded-t-lg bg-gray-800 p-4 ring-2 ring-gray-400 ${showLog === 'challenge' ? 'bg-gray-700 bg-opacity-50' : ''}`}
          onClick={() => setShowLog('challenge')}
        >
          Quest Log
        </button>
        <button
          className={`rounded-t-lg bg-gray-800 p-4 ring-2 ring-gray-400 ${showLog === 'sidequest' ? 'bg-gray-700 bg-opacity-50' : ''}`}
          onClick={() => setShowLog('sidequest')}
        >
          Side Quest Log
        </button>
      </div>
      {showLog === 'challenge' ? (
        <div className="flex flex-col items-center justify-center pb-4 font-mono text-green-300">
          <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl shadow-gray-950">
            <h3 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              {' '}
              Quest Log
            </h3>
            <div className="h-[50rem] overflow-y-scroll ">
              <ul className="space-y-4 ">
                {completions.length === 0 ? (
                  <p>No quests completed yet. Get started!</p>
                ) : (
                  completions.map((completion) => (
                    <li
                      key={completion.completionId}
                      className="mr-2 flex flex-col rounded border border-gray-700 bg-gray-800 p-4 shadow"
                    >
                      <span className="mb-2  w-full text-center text-xl font-semibold text-green-300">
                        Quest: {completion.challengeTitle}
                      </span>{' '}
                      <span className="mb-4 w-full text-center text-lg text-blue-300">
                        Status:{' '}
                        {completion.status.charAt(0).toUpperCase() +
                          completion.status.slice(1)}
                      </span>
                      <div className="w-full space-y-1 text-left text-base">
                        {' '}
                        <p className="text-sm text-gray-400">
                          Completed on:{' '}
                          {new Date(
                            completion.completed_at,
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong className="text-green-200">
                            Description:
                          </strong>{' '}
                          {completion.challengeDescription}
                        </p>
                        <p>
                          <strong className="text-green-200">XP Reward:</strong>{' '}
                          {completion.xp_reward}
                        </p>
                        <p>
                          <strong className="text-green-200">Attribute:</strong>{' '}
                          {completion.attribute}
                        </p>
                        <p>
                          <strong className="text-green-200">
                            Difficulty:
                          </strong>{' '}
                          {completion.difficulty}
                        </p>
                      </div>
                      <hr className="my-4 w-full border-t border-gray-700" />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {showLog === 'sidequest' && sideQuests ? (
        <div className="flex flex-col items-center justify-center pb-4 font-mono text-green-300 ">
          <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl shadow-gray-950">
            <h3 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              {' '}
              Side Quest Log
            </h3>
            <div className="h-[50rem] overflow-y-scroll ">
              <ul className="space-y-4">
                {sideQuests.length === 0 || !sideQuests ? (
                  <p>No side quests completed yet. Get started!</p>
                ) : (
                  sideQuests.map((quest) => (
                    <li
                      key={quest.id}
                      className="mr-2 flex flex-col  rounded border border-gray-700 bg-gray-800 p-4 shadow"
                    >
                      <span className="mb-2 w-full text-center text-xl font-semibold capitalize text-green-300">
                        Side Quest: {quest.title}
                      </span>{' '}
                      <div className="w-full space-y-1 text-left text-base">
                        {' '}
                        <p className="text-sm text-gray-400">
                          Completed on:{' '}
                          {new Date(quest.completed_at).toLocaleDateString()}
                        </p>
                        <p>
                          <strong className="text-green-200">
                            Description:
                          </strong>{' '}
                          {quest.description}
                        </p>
                        <p>
                          <strong className="text-green-200">XP Reward:</strong>{' '}
                          25
                        </p>
                        <p>
                          <strong className="text-green-200">Attribute:</strong>{' '}
                          {quest.attribute}
                        </p>
                      </div>
                      <hr className="my-4 w-full border-t border-gray-700" />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default ActivityLog
