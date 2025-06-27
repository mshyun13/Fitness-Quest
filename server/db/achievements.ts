import db from './connection.ts'

export async function getAllAchievements() {
  const res = await db('achievements').select()
  console.log('db', res)
  return res
}
