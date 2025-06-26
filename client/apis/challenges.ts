import request from 'superagent'
import { Challenge } from '../../models/challenge'

const rootUrl = '/api/v1'

export async function getChallenges() {
  const response = await request.get(`${rootUrl}/challenges`)
  return response.body as Challenge[]
}

export async function getSingleChallenge(id: number) {
  const response = await request.get(`${rootUrl}/challenges/${id}`)
  return response.body as Challenge[]
}
