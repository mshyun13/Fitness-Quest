import request from 'superagent'
import { PostData } from '../../models/posts'

const rootUrl = '/api/v1/posts'

export async function getAllPosts(): Promise<unknown> {
  const res = await request.get(rootUrl)
  return res.body.reverse()
}

export async function addPost(data: PostData) {
  const res = await request
    .post(rootUrl)
    .send(data)
    .then((res) => res.body)
  return res.body
}
