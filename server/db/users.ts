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

export async function addUser(data: UserData) {
  const [id] = await db('users').insert(data)
  return id
}

export async function updateUser(data: UpdateUser) {
  if (!data.id) return
  const res = await db('users').where('id', data.id).update(data)
  return res
}
