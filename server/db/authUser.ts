import connection from './connection'

const db = connection

export interface AuthUser {
  auth_id: string
  name: string
  xp: number
  level: number
  rank: string
  str: number
  dex: number
  int: number
  missed: number
  class: string
  appearance: number
  gender: string
}

export async function getUserByAuth(auth_id: string) {
  const result = await db('users').where('auth_id', auth_id).select()
  return result
}

export async function createUser(user: AuthUser) {
  await db('users').insert({
    auth_id: user.auth_id,
    name: user.name,
    xp: user.xp,
    level: user.level,
    rank: user.rank,
    str: user.str,
    dex: user.dex,
    int: user.int,
    missed: user.missed,
    class: user.class,
    appearance: user.appearance,
    gender: user.gender,
  })
}
