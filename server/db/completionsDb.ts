import connection from './connection'
import {
  CompletionOfChallenge,
  NewCompletion,
} from '../../models/completionsModel'

// Gets completion and challenge data for a user
export async function getCompletionsByUserId(
  userId: string,
): Promise<CompletionOfChallenge[]> {
  return connection('completions')
    .join('challenges', 'completions.challenge_id', 'challenges.id')
    .where('completions.user_id', userId)
    .select(
      'completions.id as completionId',
      'completions.completed_at',
      'completions.status',

      'challenges.id as challengeId',
      'challenges.title as challengeTitle',
      'challenges.description as challengeDescription',
      'challenges.xp_reward',
      'challenges.attribute',
      'challenges.difficulty',
    )
    .orderBy('completions.completed_at', 'desc') // Most recent will show first
}

// For when adding to DB
export async function addCompletion(
  newCompletion: NewCompletion,
): Promise<number[]> {
  return connection('completions').insert({
    user_id: newCompletion.userId,
    challenge_id: newCompletion.challengeId,
    status: newCompletion.status,
    completed_at: connection.fn.now(),
  })
}
