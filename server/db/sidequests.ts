import db from './connection.ts'
import {
  getLevelFromTotalXp,
  getXpForLeveling,
  getRankByLevel,
} from '../utils/xpLogic.ts'
import { User } from '../../models/users.ts'
import { Knex } from 'knex'

export async function getSideQuestsById(id: number) {
  const quests = await db('sidequests').where('user_id', id).select()
  return quests
}

interface SideQuestData {
  user_id: number
  title: string
  description: string
  attribute: string
  completed_at: string
}

// --- //
interface UserStatUpdate {
  userNewXp: number
  userNewLevel: number
  levelUpHappened: boolean
}

export async function updateUserStats(
  trx: Knex.Transaction,
  userId: number,
  xpGain: number,
  attributeToIncrement?: 'str' | 'dex' | 'int',
): Promise<UserStatUpdate> {
  let levelUpHappened = false

  // Get users current xp and attribute stats
  const user = (await trx('users')
    .where('id', userId)
    .select('xp', 'level', 'str', 'dex', 'int')
    .first()) as User

  if (!user) {
    throw new Error('User Not Found')
  }

  const updatedUser: User = { ...user }

  // Add SideQuest XP
  updatedUser.xp = (updatedUser.xp || 0) + xpGain
  const originalLevel = updatedUser.level || 0

  // Recalculate level based on total XP
  const newCalculatedLevel = getLevelFromTotalXp(updatedUser.xp)
  if (newCalculatedLevel > originalLevel) {
    levelUpHappened = true
  }
  updatedUser.level = newCalculatedLevel

  // Set XP relative to new level
  const xpAtStartOfCurrentLevel = getXpForLeveling(updatedUser.level)
  updatedUser.xp = updatedUser.xp - xpAtStartOfCurrentLevel

  if (attributeToIncrement) {
    const currentAttributeValue = updatedUser[attributeToIncrement]
    let newAttributeValue = currentAttributeValue + 1

    if (newAttributeValue > 100) {
      const bonusXpFromAttribute = newAttributeValue - 100
      newAttributeValue = 1

      updatedUser.xp = (updatedUser.xp || 0) + bonusXpFromAttribute

      const xpAfterBonus = getXpForLeveling(updatedUser.level) + updatedUser.xp

      const levelAfterBonus = getLevelFromTotalXp(xpAfterBonus)
      if (levelAfterBonus > updatedUser.level) {
        levelUpHappened = true
        updatedUser.level = levelAfterBonus
        const xpAfterLevelBonus = getXpForLeveling(updatedUser.level)
        updatedUser.xp = updatedUser.xp - xpAfterLevelBonus
      }
    }
    updatedUser[attributeToIncrement] = newAttributeValue
  }
  updatedUser.rank = getRankByLevel(updatedUser.level)

  await trx('users')
    .where('id', userId)
    .update({
      xp: updatedUser.xp,
      level: updatedUser.level,
      str: updatedUser.str,
      dex: updatedUser.dex,
      int: updatedUser.int,
      rank: updatedUser.rank || 'Unranked',
    })

  return {
    userNewXp: updatedUser.xp,
    userNewLevel: updatedUser.level,
    levelUpHappened: levelUpHappened,
  }
}

export async function addSideQuest(data: SideQuestData) {
  const { user_id, title, attribute, description, completed_at } = data
  const quest = await db('sidequests').insert({
    user_id,
    title,
    attribute,
    description,
    completed_at,
  })
  return quest
}

export async function addSideQuestXp(data: SideQuestData) {
  return db.transaction(async (trx) => {
    const SIDE_QUEST_XP = 20 // Fixed XP per SideQuest

    const { user_id, title, description, attribute, completed_at } = data

    // Insert SideQuest for DB
    await trx('sidequests').insert({
      user_id,
      title,
      description,
      attribute,
      completed_at,
    })
    await updateUserStats(
      trx,
      user_id,
      SIDE_QUEST_XP,
      attribute as 'str' | 'dex' | 'int',
    )
  })
}
