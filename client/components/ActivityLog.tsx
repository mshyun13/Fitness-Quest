import { useCompletions } from '../hooks/useCompletions.ts'

function ActivityLog() {
  const { completions, loading, error } = useCompletions()

  if (loading) {
    return <p>Loading your activity log...</p>
  }

  if (error) {
    return <p>Error loading bro! {error}</p>
  }

  if (completions.length === 0) {
    return <p>No challenges completed yet. Get started!</p>
  }

  return (
    <div>
      <h3>Your Activity Log</h3>
      <ul>
        {completions.map((completion) => (
          <li key={completion.completionId}>
            <span>{completion.challengeTitle}</span>{' '}
            <span>
              {completion.status.charAt(0).toUpperCase() +
                completion.status.slice(1)}
            </span>
            <br />
            <span>
              Completed on: {new Date(completion.completed_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityLog
