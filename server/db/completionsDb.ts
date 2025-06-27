import connection from './connection'
import {
  CompletionOfChallenge,
  NewCompletion,
  CompletionResult,
} from '../../models/completionsModel'
import { getLevelFromTotalXp } from '../utils/xpLogic'
import { getSingleChallenge } from './challenges'
import { User } from '../../models/users'

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

export async function getChallengesDoneToday(
  userId: number,
): Promise<number[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return connection('completions')
    .where('user_id', userId)
    .where('status', 'completed')
    .where('completed_at', '>=', today.toISOString()) // Filter for daily completions only
    .select('challenge_id')
    .then((rows) => rows.map((row) => row.challenge_id))
}

export async function processChallengeCompletion(
  userId: number,
  challengeId: number,
  status: 'completed' | 'missed',
): Promise<CompletionResult> {
  return connection.transaction(async (trx) => {
    let levelUpHappened = false

    const user = await trx('users')
      .where('id', userId)
      .select('xp', 'level', 'str', 'dex', 'int')
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser: Partial<User> = { ...user } as User

    if (status === 'completed') {
      const challenge = await getSingleChallenge(challengeId, trx)

      if (!challenge) {
        throw new Error('Challenge not found')
      }

      updatedUser.xp = (updatedUser.xp || 0) + challenge.xp_reward
      const newCalculatedLevel = getLevelFromTotalXp(updatedUser.xp)

      if (newCalculatedLevel > (user.level || 0)) {
        levelUpHappened = true
        updatedUser.level = newCalculatedLevel
      }

      const attributeToUpdate = challenge.attribute.toLowerCase() as
        | 'str'
        | 'dex'
        | 'int'

      const currentAttributeValue = user[attributeToUpdate] || 0
      let newAttributeValue = currentAttributeValue + 1

      if (newAttributeValue > 100) {
        const bonusXpFromAttribute = newAttributeValue - 100
        newAttributeValue = 1

        updatedUser.xp = (updatedUser.xp || 0) + bonusXpFromAttribute

        const reCalculatedLevel = getLevelFromTotalXp(updatedUser.xp)
        if (reCalculatedLevel > (updatedUser.level || 0)) {
          levelUpHappened = true
          updatedUser.level = reCalculatedLevel
        }
      }

      updatedUser[attributeToUpdate] = newAttributeValue
    }

    await trx('users')
      .where('id', userId)
      .update({
        xp: updatedUser.xp || 0,
        level: updatedUser.level || 0,
        str: updatedUser.str || 0,
        dex: updatedUser.dex || 0,
        int: updatedUser.int || 0,
      })

    const [_completionId] = await trx('completions').insert({
      user_id: userId,
      challenge_id: challengeId,
      status: status,
      completed_at: connection.fn.now(),
    })

    return {
      userNewXp: updatedUser.xp!,
      userNewLevel: updatedUser.level!,
      levelUpHappened: levelUpHappened,
    }
  })
}
