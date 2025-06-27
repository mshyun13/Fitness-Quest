import connection from './connection'
import {
  CompletionOfChallenge,
  NewCompletion,
} from '../../models/completionsModel'
import { getLevelFromTotalXp } from '../utils/xpLogic'
import { getSingleChallenge } from './challenges'

interface CompletionResult {
  completionId: number
  userNewXp: number
  userNewLevel: number
  levelUpHappened: boolean
  message: string
}

// Gets completion and challenge data for a user
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

export async function processChallengeCompletion(
  userId: number,
  challengeId: number,
  status: 'completed' | 'missed',
): Promise<CompletionResult> {
  return connection.transaction(async (trx) => {
    let levelUpHappened = false
    let xpGain = 0

    // 1. Get challenge XP reward (only if status is 'completed')
    if (status === 'completed') {
      const challenge = await getSingleChallenge(challengeId).transacting(trx)
      if (!challenge) {
        throw new Error('Challenge not found')
      }
      xpGain = challenge.xp_reward
    }

    // 2. Get user's current XP and level
    const user = await trx('users')
      .where('id', userId)
      .select('xp', 'level')
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    // 3. Calculate new XP and level
    const newXp = user.xp + xpGain
    const newLevel = getLevelFromTotalXp(newXp)

    if (newLevel > user.level) {
      levelUpHappened = true
    }

    // 4. Update user's XP and level in the database
    await trx('users').where('id', userId).update({
      xp: newXp,
      level: newLevel,
    })

    // 5. Add the completion record
    const [completionId] = await trx('completions').insert({
      user_id: userId,
      challenge_id: challengeId,
      status: status,
      completed_at: connection.fn.now(),
    })

    return {
      completionId,
      userNewXp: newXp,
      userNewLevel: newLevel,
      levelUpHappened,
      message: levelUpHappened
        ? 'Challenge completed and leveled up!'
        : 'Challenge completed.',
    }
  })
}
