import { ChangeEvent, useState } from 'react'
import { useAddSideQuestsQuery } from '../hooks/useSideQuests'
import { useUserByAuth0 } from '../hooks/useUsers'

type SetAppNotification = (
  message: string,
  type?: 'success' | 'error' | 'info',
) => void

interface ManualEntryProps {
  onClose: () => void
  setAppNotification: SetAppNotification
  onUserUpdate: () => void
  userId: number
}

const ManualEntryForm: React.FC<ManualEntryProps> = ({
  onClose,
  setAppNotification,
  onUserUpdate,
  userId,
}) => {
  const date = new Date().toISOString().slice(0, 10)
  // const { data: user } = useUserByAuth0()
  const [formData, setFormData] = useState({
    user_id: userId,
    title: '',
    attribute: '',
    description: '',
    completed_at: date,
  })

  const mutateSideQuests = useAddSideQuestsQuery()

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: event.currentTarget.value })
  }
  const handleAttribute = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, attribute: event.target.value })
  }
  const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: event.target.value })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    try {
      const dataToSend = { ...formData, user_id: userId }
      await mutateSideQuests.add.mutateAsync({ data: dataToSend })
      setAppNotification(`Side Quest "${formData.title}" entered!`, 'success')
      onUserUpdate()

      onClose()
      setFormData({
        user_id: userId,
        title: '',
        attribute: '',
        description: '',
        completed_at: date,
      })
    } catch (error) {
      // Handle errors during mutation
      setAppNotification('Failed to add Side Quest')
      console.error('Error adding side quest:', error)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="absolute">
          <form
            onSubmit={handleSubmit}
            className="m-1 grid max-w-lg grid-cols-2 items-center place-self-center rounded-lg bg-gray-800 p-4 shadow-xl shadow-gray-950 ring-2 ring-zinc-600"
          >
            <h2 className="col-span-2 mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              Side Quest
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-0 rounded-full p-2 text-2xl font-bold text-gray-400 transition duration-200 hover:text-green-400"
              aria-label="close modal"
            >
              &times;
            </button>
            <label htmlFor="title">Enter Title:</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleTitle}
              className="m-2 rounded-lg bg-gray-700 p-1 text-white ring-2 ring-zinc-600"
            />
            <label htmlFor="attribute">Attribute:</label>
            <select
              name="attribute"
              id="attribute"
              value={formData.attribute}
              onChange={handleAttribute}
              className="m-2 rounded-lg bg-gray-700 p-1 text-white ring-2 ring-zinc-600"
            >
              <option value=""></option>
              <option value="str">STR</option>
              <option value="dex">DEX</option>
              <option value="int">INT</option>
            </select>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleDescription}
              className="m-2 rounded-lg bg-gray-700 p-1 text-white ring-2 ring-zinc-600"
            />
            <button
              type="submit"
              className="col-span-2 m-2 place-self-center rounded-lg p-2 ring-2 ring-zinc-400 transition-colors duration-500 ease-in-out hover:bg-zinc-700"
              disabled={
                formData.title === '' ||
                formData.description === '' ||
                formData.attribute === ''
              }
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ManualEntryForm
