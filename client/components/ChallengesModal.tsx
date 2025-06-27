import React from 'react'
import { Challenge } from '../../models/challenge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCompletionApi } from '../apis/completions'
import { CompletionResult } from '../../models/completionsModel'

interface ChallengeModalProps {
  challenge: Challenge
  onClose: () => void
  currentUserId: number
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onClose,
  currentUserId,
}) => {
  if (!challenge) {
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient()

  // Mutation to add a completed challenge
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const completeChallengeMutation = useMutation<
    CompletionResult,
    Error,
    { userId: number; challengeId: number; status: 'completed' | 'missed' }
  >({
    mutationFn: addCompletionApi,
    onSuccess: (data) => {
      console.log('Challenge completion successful:', data)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      onClose()
      alert(
        `Challenge completed! You are now Level ${data.userNewLevel} with ${data.userNewXp} XP.`,
      )
      if (data.levelUpHappened) {
        alert('Congratulations! You leveled up!')
      }
    },
    onError: (error) => {
      console.error('Failed to complete challenge:', error)
      alert(`Error completing challenge: ${error.message}`)
    },
  })

  const handleCompleteChallenge = () => {
    completeChallengeMutation.mutate({
      userId: currentUserId,
      challengeId: challenge.id,
      status: 'completed',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 font-mono">
      <div className="relative mx-4 w-full max-w-lg rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-400 transition duration-200 hover:text-green-400"
          aria-label="close modal"
        >
          &times;
        </button>

        <h2 className="mb-4 border-b-2 border-green-700 pb-2 text-center text-3xl font-bold text-green-400">
          {challenge.title}
        </h2>

        <div className="space-y-3 text-green-300">
          <p className="text-xl">
            <strong className="text-green-200">Attribute:</strong>{' '}
            {challenge.attribute.toUpperCase()}
          </p>
          <p className="text-xl">
            <strong className="text-green-200">Difficulty:</strong>{' '}
            {challenge.difficulty.charAt(0).toUpperCase() +
              challenge.difficulty.slice(1)}
          </p>
          <p className="text-lg">
            <strong className="text-green-200">Description:</strong>{' '}
            {challenge.description}
          </p>
          <p className="text-xl">
            <strong className="text-green-200">XP Reward:</strong>{' '}
            {challenge.xp_reward} XP
          </p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleCompleteChallenge}
            disabled={completeChallengeMutation.isPending}
            className="rounded bg-blue-600 px-6 py-2 font-bold text-white transition duration-200 hover:bg-blue-700"
          >
            {completeChallengeMutation.isPending
              ? 'Completing...'
              : 'Complete Challenge'}
          </button>

          {completeChallengeMutation.isError && (
            <p className="mt-2 text-red-500">
              Error: {completeChallengeMutation.error?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChallengeModal
