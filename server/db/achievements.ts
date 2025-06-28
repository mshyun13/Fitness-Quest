import { AddAchievements } from '../../models/achievements.ts'
import db from './connection.ts'

export async function getAllAchievements() {
  const res = await db('achievements').select()
  return res
}

export async function getAchievementsById(id: number) {
  const res = await db('achievements_user')
    .join('achievements', 'achievements_user.id', 'achievements.id')
    .where('user_id', id)
    .select(
      'achievements.id as id',
      'achievements.title as title',
      'achievements.description as description',
      'achievements.reward as reward',
    )
  return res
}

export async function addAchievements(data: AddAchievements) {
  const res = await db('achievements_user').insert(data)
  return res
}
