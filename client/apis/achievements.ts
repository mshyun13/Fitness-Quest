import request from 'superagent'

const rootUrl = '/api/v1'

export function getAllAchievements(): Promise<unknown> {
  return request.get(rootUrl + '/achievements').then((res) => {
    console.log('api', res.body)
    return res.body
  })
}
