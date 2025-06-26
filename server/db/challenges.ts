import db from './connection.ts'

export async function getAllChallenges() {
  const challenges = await db('challenges').select()
  return challenges
}

export async function getSingleChallenge(id: number) {
  const challenge = await db('challenges').where('id', id).select()
  return challenge
}
