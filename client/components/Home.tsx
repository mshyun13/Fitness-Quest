import { useChallenge, useChallenges } from '../hooks/useChallenges'

function Home() {
  const { data } = useChallenges()
  console.log(data)

  return (
    <>
      <div>
        <p>Hello Challenges</p>
        <ul>
          {data &&
            data.map((challenge) => (
              <li key={challenge.id}>
                <p>
                  {`Title: ${challenge.title}, Description: ${challenge.description}, Xp_reward: ${challenge.xp_reward}, Attribute: ${challenge.attribute}, Difficultiy: ${challenge.difficulty}`}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default Home
