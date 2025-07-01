import request from 'superagent'
import { PostData } from '../../models/posts'

const rootUrl = '/api/v1/posts'

interface PostArr {
  content: string
  date: string
  id: number
  level: number
  name: string
  rank: string
  user_id: number
}

export async function getAllPosts(): Promise<unknown> {
  const res = await request.get(rootUrl)
  return res.body.reverse() as PostArr[]
}

export async function addPost(data: PostData) {
  const res = await request
    .post(rootUrl)
    .send(data)
    .then((res) => res.body)
  return res.body
}
