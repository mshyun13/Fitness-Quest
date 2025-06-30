import db from './connection.ts'

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
