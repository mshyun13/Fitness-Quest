import { UpdateUser, User, UserData } from '../../models/users.ts'
import db from './connection.ts'

export async function getAllUsers() {
  const users = await db('users').select()
  return users as User[]
}

export async function getUserById(id: number) {
  const user = await db('users').select().first().where({ id })
  return user as User
}

export async function getUserByAuthId(
  authId: string,
): Promise<User | undefined> {
  const user = await db('users')
    .select(
      'id',
      'auth_id',
      'name',
      'xp',
      'level',
      'rank',
      'str',
      'dex',
      'int',
      'missed',
      'class',
      'appearance',
      'gender',
    )
    .where('auth_id', authId)
    .first()
  return user as User | undefined
}

export async function addUser(data: UserData) {
  const [id] = await db('users').insert({
    auth_id: data.auth_id,
    name: data.name,
    class: data.class,

    xp: 0,
    level: 1,
    rank: 'bronze',
    str: 0,
    dex: 0,
    int: 0,
    missed: 0,
    appearance: 0,
  })
  return id
}

export async function updateUser(data: UpdateUser) {
  if (!data.id) {
    console.error('UpdateUser fucntion error')
    return 0
  }
  const res = await db('users').where('id', data.id).update(data)
  return res
}

export async function updateUserByAuthId(
  authId: string,
  updates: Partial<Omit<User, 'id' | 'auth_id'>>, // Stops 'id' & 'auth_id' from updating
): Promise<number> {
  const updatedRows = await db('users').where('auth_id', authId).update(updates)
  return updatedRows
}
