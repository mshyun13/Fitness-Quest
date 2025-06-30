import db from './connection.ts'
import { getLevelFromTotalXp, getXpForLeveling } from '../utils/xpLogic.ts'
import { getRankByLevel } from './completionsDb.ts'
import { User } from '../../models/users.ts'
import { Challenge } from '../../models/challenge.ts'

export async function getSideQuestsById(id: number) {
  const quests = await db('sidequests').where('user_id', id).select()
  console.log('db', quests)
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
  })
}
