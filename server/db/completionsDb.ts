import connection from './connection'
import {
  CompletionOfChallenge,
  NewCompletion,
  CompletionResult,
} from '../../models/completionsModel'
import { calculateXpToCompleteLevel, checkLevelUp } from '../utils/xpLogic'
import { getSingleChallenge } from './challenges'
import { User } from '../../models/users'

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
  newCompletion: NewCompletion,
): Promise<number[]> {
  return connection('completions').insert({
    user_id: newCompletion.userId,
    challenge_id: newCompletion.challengeId,
    status: newCompletion.status,
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
    let levelUpHappened = false

    // Gets users current stats in the transaction
    const user = await trx('users')
      .where('id', userId)
      .select('xp', 'level', 'str', 'dex', 'int')
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    // eslint-disable-next-line prefer-const
    let updatedUser: Partial<User> = { ...user } as User

    // Gets completed challenges
    if (status === 'completed') {
      const challenge = await getSingleChallenge(challengeId, trx)

      if (!challenge) {
        throw new Error('Challenge not found')
      }

      updatedUser.xp = (updatedUser.xp || 0) + challenge.xp_reward // Adds challenge xp
      // const newCalculatedLevel = getLevelFromTotalXp(updatedUser.xp) // Calculates new level based on new xp total

      // Checks for level-up
      if (checkLevelUp(updatedUser.level, updatedUser.xp) > updatedUser.level) {
        do {
          levelUpHappened = true
          updatedUser.level = checkLevelUp(updatedUser.level, updatedUser.xp)
          const previousXP = calculateXpToCompleteLevel(updatedUser.level - 1)
          updatedUser.xp = updatedUser.xp - previousXP
        } while (
          checkLevelUp(updatedUser.level, updatedUser.xp) > updatedUser.level
        )
      }

      // Determines which attribute to update
      const attributeToUpdate = challenge.attribute.toLowerCase() as
        | 'str'
        | 'dex'
        | 'int'

      const currentAttributeValue = user[attributeToUpdate] || 0
      let newAttributeValue = currentAttributeValue + 1 // adds to the relevant attribute

      // When str, dex or int get to 100, clear the bar and start again
      if (newAttributeValue > 100) {
        const bonusXpFromAttribute = newAttributeValue - 100 // bonus xp for filling the bar
        newAttributeValue = 1

        updatedUser.xp = (updatedUser.xp || 0) + bonusXpFromAttribute // add bonus xp

        //const reCalculatedLevel = getLevelFromTotalXp(updatedUser.xp) // recalculate level to account for bonus xp

        const reCalculatedLevel = checkLevelUp(
          updatedUser.level,
          updatedUser.xp,
        )

        // Checks for another level-up because of bonus xp
        if (reCalculatedLevel > (updatedUser.level || 0)) {
          levelUpHappened = true
          updatedUser.level = reCalculatedLevel
          console.log('whoops')
          const previousXP = calculateXpToCompleteLevel(newCalculatedLevel - 1)
          updatedUser.xp -= previousXP
        }
      }

      updatedUser[attributeToUpdate] = newAttributeValue // Assigns new attribute values
    }

    // Update users xp in DB within transaction
    await trx('users')
      .where('id', userId)
      .update({
        xp: updatedUser.xp || 0,
        level: updatedUser.level || 0,
        str: updatedUser.str || 0,
        dex: updatedUser.dex || 0,
        int: updatedUser.int || 0,
      })

    // Inserts completion into DB within transaction
    const [_completionId] = await trx('completions').insert({
      user_id: userId,
      challenge_id: challengeId,
      status: status,
      completed_at: new Date(),
    })

    // returns newly calculated results
    return {
      userNewXp: updatedUser.xp!,
      userNewLevel: updatedUser.level!,
      levelUpHappened: levelUpHappened,
    }
  })
}
