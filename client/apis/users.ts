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

// get user by auth0 ID

export async function getUserByAuth0(token: string) {
  return await request
    .get(`${rootUrl}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => (res.body.username ? res.body.username : null))
}

// add user with auth0 ID

interface NewUserData {
  newUser: {
    name: string
    xp: number
    level: number
    rank: string
    str: number
    dex: number
    int: number
    missed: number
    class: string
    appearance: number
  }
  token: string
}

export function addUserByAuth0({ newUser, token }: NewUserData) {
  return request
    .post(`${rootUrl}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((res) => res.body.user)
}
