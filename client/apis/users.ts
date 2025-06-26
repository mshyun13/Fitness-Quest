import request from 'superagent'
import { User, UserData } from '../../models/users'

const rootUrl = '/api/v1'

export function getAllUsers(): Promise<User[]> {
  return request.get(rootUrl + '/users').then((res) => {
    return res.body
  })
}

export function getUserById(id: number): Promise<User> {
  return request.get(rootUrl + `/users/${id}`).then((res) => {
    console.log('api', res.body.user)
    return res.body.user as User
  })
}

export function addUser(data: UserData) {
  return request
    .post(rootUrl + '/users')
    .send(data)
    .then((res) => {
      return res.body
    })
}

// export function addUser({ auth_id, name, class }: UserData){
//   return request.post(rootUrl + '/users').send({ auth_id, name, class }).then((res) => {
//     return res.body
//   })
// }
