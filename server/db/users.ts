import { User, UserData } from '../../models/users.ts'
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
  console.log('db', data)
  const [id] = await db('users').insert(data)
  return id
}
