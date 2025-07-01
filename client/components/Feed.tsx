import { useAuth0 } from '@auth0/auth0-react'
import { useLeaderboard } from '../hooks/useUsers.ts'
import { usePosts } from '../hooks/usePosts.ts'

function Feed() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()
  const { data: posts } = usePosts()
  const mutatePosts = usePosts()

  if (!posts) {
    return <p>Error Loading posts</p>
  }

  if (!isAuthenticated) {
    return <p>Please log in to view Leaderboard</p>
  }

  console.log(posts[1]?.date, typeof posts[0]?.date.toLocaleString())

  const handleSubmit = () => {
    mutatePosts.add.mutate({
      user_id: 2,
      content: 'test 4 for another user',
    })
  }

  return (
    <>
      <button onClick={handleSubmit}>POST</button>
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 pb-12 pt-8 font-mono text-green-300 shadow-xl shadow-gray-950 sm:p-2">
        <h3 className="mb-4 border-b-2 border-green-700 pb-4 text-center text-2xl font-bold text-green-400">
          {' '}
          Quest Feed
        </h3>
        {posts?.map((post) => {
          return (
            <div
              key={post.id}
              className="justify-content-center mb-4 mt-5 flex w-full items-center gap-1 justify-self-center rounded-2xl border border-gray-600 bg-gray-700 p-2 shadow-xl shadow-gray-900 sm:gap-4 sm:p-4"
            >
              {' '}
              <div className="grid w-full grid-cols-[2fr_2fr_1fr_3fr] items-center font-medium sm:gap-1 sm:text-xl">
                <p className="text-left capitalize">{post?.name}</p>
                <p className="text-left text-sm text-white">
                  LVL:{post?.level}
                </p>
                <p className="text-left text-sm capitalize text-white">
                  {post?.rank}
                </p>

                <p className="text-right text-sm text-gray-400">
                  {post?.date.toLocaleString().slice(0, 16)}
                </p>
                <p className="text-md col-span-4 mt-4 text-left capitalize text-white">
                  {post?.content}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Feed
