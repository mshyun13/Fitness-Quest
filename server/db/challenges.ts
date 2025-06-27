import db from './connection.ts'
import { Knex } from 'knex'

export async function getAllChallenges() {
  const challenges = await db('challenges').select()
  return challenges
}

export async function getSingleChallenge(id: number, trx?: Knex.Transaction) {
  const connection = trx || db
  const challenge = await connection('challenges')
    .where('id', id)
    .select()
    .first()
  return challenge
}
