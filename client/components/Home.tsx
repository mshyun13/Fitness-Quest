import { useChallenge, useChallenges } from '../hooks/useChallenges'
import { useState } from 'react'

import ActivityLog from './ActivityLog'

function Home() {
  const { data } = useChallenges()

  const [activityLog, setActivityLog] = useState(false)
  const toggleActivityLog = () => {
    setActivityLog(!activityLog)
  }

  return (
    <>
      <div>
        <p>Hello Challenges</p>
        <ul>
          {data &&
            data.map((challenge) => (
              <li key={challenge.id}>
                <p>
                  {`Title: ${challenge.title}, Description: ${challenge.description}, Xp_reward: ${challenge.xp_reward}, Attribute: ${challenge.attribute}, Difficulty: ${challenge.difficulty}`}
                </p>
              </li>
            ))}
        </ul>
      </div>

      <button onClick={toggleActivityLog}>
        {activityLog ? 'Hide' : 'Show'}
      </button>

      {activityLog && <ActivityLog />}
    </>
  )
}

export default Home
