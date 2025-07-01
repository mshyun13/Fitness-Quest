import { useAuth0 } from '@auth0/auth0-react'
import { usePosts } from '../hooks/usePosts.ts'
import { ChangeEvent, useState } from 'react'
import { useUserByAuth0 } from '../hooks/useUsers.ts'

function Feed() {
  const { isAuthenticated } = useAuth0()
  const { data: user } = useUserByAuth0()
  const { data: posts } = usePosts()
  const mutatePosts = usePosts()
  const [formData, setFormData] = useState({
    content: '',
  })
  const [showForm, setShowForm] = useState(false)

  if (!posts) {
    return <p>Loading posts</p>
  }

  if (!isAuthenticated) {
    return <p>Please log in to view Leaderboard</p>
  }

  if (!user) return <p>Please log in to view posts</p>

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    // if (!user) return
    mutatePosts.add.mutate({
      user_id: user.id,
      content: formData.content,
    })
    setFormData({ content: '' })
    setShowForm(false)
  }

  const handleContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    setFormData({ ...formData, content: event.target.value })
  }

  console.log(posts)

  return (
    <>
      <button
        className="mb-6 rounded-lg bg-gray-700 p-2 text-xl font-bold text-green-400 shadow-lg shadow-gray-950 ring-1 ring-gray-400 hover:bg-gray-500"
        onClick={() => setShowForm(true)}
        disabled={showForm}
      >
        Add Post
      </button>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="absolute">
            <form
              onSubmit={handleSubmit}
              className="m-1 max-w-xl items-center place-self-center rounded-lg bg-gray-800 p-4 shadow-xl shadow-gray-950 ring-2 ring-zinc-600"
            >
              <label
                htmlFor="content"
                className="border-b-2 border-green-700 text-center text-2xl font-bold text-green-400"
              >
                Add Post
              </label>
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-2 top-0 rounded-full p-2 text-2xl font-bold text-gray-400 transition duration-200 hover:text-green-400"
                aria-label="close modal"
              >
                &times;
              </button>
              <textarea
                id="content"
                rows={4}
                value={formData.content}
                onChange={handleContent}
                className="my-6 w-full rounded-lg bg-gray-700 p-1 text-white ring-2 ring-zinc-600"
              />
              <button
                type="submit"
                className="m-2 place-self-center rounded-lg p-2 ring-2 ring-zinc-400 transition-colors duration-500 ease-in-out hover:bg-zinc-700"
                disabled={formData.content === '' || !user}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : null}
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
