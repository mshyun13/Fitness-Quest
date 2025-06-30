import request from 'superagent'
import { Challenge } from '../../models/challenge'

const rootUrl = '/api/v1'

export async function getChallenges(token: string): Promise<Challenge[]> {
  const response = await request
    .get(`${rootUrl}/challenges`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as Challenge[]
}

export async function getSingleChallenge(id: number): Promise<Challenge[]> {
  const response = await request.get(`${rootUrl}/challenges/${id}`)
  return response.body as Challenge[]
}
