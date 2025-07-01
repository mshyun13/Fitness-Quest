import { PostData } from '../../models/posts.ts'
import db from './connection.ts'

export async function getAllPosts(): Promise<unknown> {
  return db('posts')
    .join('users', 'users.id', 'user_id')
    .select(
      'posts.id as id',
      'user_id',
      'content',
      'date',
      'users.name as name',
      'users.rank as rank',
      'users.level as level',
    )
}

export async function addPost(data: PostData): Promise<unknown> {
  return db('posts').insert(data).returning('*')
}
