import request from 'superagent'
import { UpdateUser, User, UserData } from '../../models/users'

const rootUrl = '/api/v1'

export function getAllUsers(): Promise<User[]> {
  return request.get(rootUrl + '/users').then((res) => {
    return res.body
  })
}

export function getUserById(id: number): Promise<User> {
  return request.get(rootUrl + `/users/${id}`).then((res) => {
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

export function updateUser(data: UpdateUser): Promise<unknown> {
  if (!data.id) {
    console.log('API Error: No ID')
  }
  return request
    .patch(rootUrl + `/users/${data.id}`)
    .send(data)
    .then((res) => {
      return res.body
    })
}
