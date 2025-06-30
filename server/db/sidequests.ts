import db from './connection.ts'
import { getLevelFromTotalXp, getXpForLeveling } from '../utils/xpLogic.ts'
import { getRankByLevel } from './completionsDb.ts'
import { User } from '../../models/users.ts'
import { Challenge } from '../../models/challenge.ts'

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

    // Get users current xp and attribute stats
    const user = await trx('users')
      .where('id', user_id)
      .select('xp', 'level', 'str', 'dex', 'int')
      .first()

    if (!user) {
      throw new Error('User Not Found')
    }

    const updatedUser: Partial<User> = { ...user } as User

    // Add SideQuest XP
    updatedUser.xp = (updatedUser.xp || 0) + SIDE_QUEST_XP

    // Recalculate level based on total XP
    const newCalculatedLevel = getLevelFromTotalXp(updatedUser.xp)

    // Set XP relative to new level
    updatedUser.level = newCalculatedLevel
    const xpAtStartOfNewLevel = getXpForLeveling(updatedUser.level)
    updatedUser.xp = updatedUser.xp - xpAtStartOfNewLevel

    // Which attribute to update? And apply update
    const attributeToUpdate = attribute as 'str' | 'dex' | 'int'

    const currentAttributeValue = user[attributeToUpdate]
    let newAttributeValue = currentAttributeValue + 1
    if (newAttributeValue > 100) {
      const bonusXpFromAttribute = newAttributeValue - 100
      newAttributeValue = 1

      updatedUser.xp = (updatedUser.xp || 0) + bonusXpFromAttribute

      const levelAfterBonus = getLevelFromTotalXp(
        getXpForLeveling(updatedUser.level) + updatedUser.xp,
      )
    }
  })
}
