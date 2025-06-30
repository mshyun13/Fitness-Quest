import { useEffect, useState } from 'react'
import { useCompletions } from '../hooks/useCompletions.ts'
import { useSideQuests } from '../hooks/useSideQuests.ts'
import { useUserByAuth0 } from '../hooks/useUsers.ts'

function ActivityLog() {
  const { completions, loading, error } = useCompletions()
  const { data: user } = useUserByAuth0()
  const { data: sideQuests, refetch } = useSideQuests(user?.id)
  const [showLog, setShowLog] = useState('challenge')

  useEffect(() => {
    if (!user?.id) return
    refetch()
  }, [refetch, user])

  if (loading) {
    return <p>Loading your activity log...</p>
  }

  if (error) {
    return <p>Error loading bro! {error}</p>
  }

  if (completions.length === 0) {
    return <p>No challenges completed yet. Get started!</p>
  }

  console.log(showLog)

  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-row items-center justify-center gap-10 rounded font-mono text-xl text-white">
        <button
          className={`rounded-t-lg p-4 ring-2 ring-gray-400 ${showLog === 'challenge' ? 'bg-gray-600 bg-opacity-50' : ''}`}
          onClick={() => setShowLog('challenge')}
        >
          Challenge Log
        </button>
        <button
          className={`rounded-t-lg p-4 ring-2 ring-gray-400 ${showLog === 'sidequest' ? 'bg-gray-600 bg-opacity-50' : ''}`}
          onClick={() => setShowLog('sidequest')}
        >
          Side Quest Log
        </button>
      </div>
      {showLog === 'challenge' ? (
        <div className="flex flex-col items-center justify-center bg-gray-900 font-mono text-green-300">
          <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
            <h3 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              {' '}
              Challenge Log
            </h3>
            <ul className="space-y-4">
              {completions.map((completion) => (
                <li
                  key={completion.completionId}
                  className="flex flex-col rounded border border-gray-700 bg-gray-800 p-4 shadow"
                >
                  <span className="mb-2 w-full text-center text-xl font-semibold text-green-300">
                    Challenge: {completion.challengeTitle}
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
                      {new Date(completion.completed_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong className="text-green-200">Description:</strong>{' '}
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
                      <strong className="text-green-200">Difficulty:</strong>{' '}
                      {completion.difficulty}
                    </p>
                  </div>
                  <hr className="my-4 w-full border-t border-gray-700" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        ''
      )}
      {showLog === 'sidequest' && sideQuests ? (
        <div className="flex flex-col items-center justify-center bg-gray-900 font-mono text-green-300">
          <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
            <h3 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              {' '}
              Side Quest Log
            </h3>
            <ul className="space-y-4">
              {sideQuests.map((quest) => (
                <li
                  key={quest.id}
                  className="flex flex-col rounded border border-gray-700 bg-gray-800 p-4 shadow"
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
                      <strong className="text-green-200">Description:</strong>{' '}
                      {quest.description}
                    </p>
                    <p>
                      <strong className="text-green-200">XP Reward:</strong> 20
                    </p>
                    <p>
                      <strong className="text-green-200">Attribute:</strong>{' '}
                      {quest.attribute}
                    </p>
                  </div>
                  <hr className="my-4 w-full border-t border-gray-700" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default ActivityLog
