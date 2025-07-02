import connection from './connection'
import {
  CompletionOfChallenge,
  CompletionResult,
} from '../../models/completionsModel'
import { getSingleChallenge } from './challenges'
// import { User } from '../../models/users'
import { updateUserStats } from './sidequests'

// Gets users completed challenges, joins challenge details
export async function getCompletionsByUserId(
  userId: number,
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
    .orderBy('completions.completed_at', 'desc')
}

// Adds new completed challenge to DB
export async function addCompletion(
  userId: number,
  challengeId: number,
  status: 'completed' | 'missed',
): Promise<number[]> {
  return connection('completions').insert({
    user_id: userId,
    challenge_id: challengeId,
    status: status,
    completed_at: new Date(),
  })
}

// Gets challenges a user has completed today
export async function getChallengesDoneToday(
  userId: number,
): Promise<number[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return connection('completions')
    .where('user_id', userId)
    .where('status', 'completed')
    .where('completed_at', '>=', today) // Filter for daily completions only
    .select('challenge_id')
    .then((rows) => rows.map((row) => row.challenge_id))
}

// Processes challenge completion or miss, updating user stats in a transaction
export async function processChallengeCompletion(
  userId: number,
  challengeId: number,
  status: 'completed' | 'missed',
): Promise<CompletionResult> {
  return connection.transaction(async (trx) => {
    let xpGain = 0
    let attributeToIncrement: 'str' | 'dex' | 'int' | undefined = undefined
    let statUpdateResult: {
      userNewXp: number
      userNewLevel: number
      levelUpHappened: boolean
    } = { userNewXp: 0, userNewLevel: 0, levelUpHappened: false }

    if (status === 'completed') {
      const challenge = await getSingleChallenge(challengeId, trx)

      if (!challenge) {
        throw new Error('Challenge not found')
      }
      xpGain = challenge.xp_reward
      attributeToIncrement = challenge.attribute.toLowerCase() as
        | 'str'
        | 'dex'
        | 'int'

      // db/sidequests.ts now handles all the calculations and DB updates
      statUpdateResult = await updateUserStats(
        trx,
        userId,
        xpGain,
        attributeToIncrement,
      )
    }

    await trx('completions').insert({
      user_id: userId,
      challenge_id: challengeId,
      status: status,
      completed_at: new Date(),
    })

    return {
      userNewXp: statUpdateResult.userNewXp,
      userNewLevel: statUpdateResult.userNewLevel,
      levelUpHappened: statUpdateResult.levelUpHappened,
    }
  })
}
