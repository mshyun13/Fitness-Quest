import request from 'superagent'
import { AchievementsData, AddAchievements } from '../../models/achievements'

const rootUrl = '/api/v1'

export function getAllAchievements(): Promise<AchievementsData[]> {
  return request.get(rootUrl + '/achievements').then((res) => {
    return res.body as AchievementsData[]
  })
}

export function getAchievementsById(id: number): Promise<AchievementsData[]> {
  return request.get(rootUrl + `/achievements/${id}`).then((res) => {
    return (res.body as AchievementsData[]) || []
  })
}

export function addAchievements(
  data: AddAchievements,
): Promise<AchievementsData[]> {
  return request
    .post(rootUrl + '/achievements')
    .send(data)
    .then((res) => {
      return res.body
    })
}
