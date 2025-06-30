import request from 'superagent'
import { User, UserData } from '../../models/users'

const rootUrl = '/api/v1'

export function getAllUsers(): Promise<User[]> {
  return request.get(rootUrl + '/users').then((res) => {
    return res.body
  })
}

// get user by auth0 ID
interface Token {
  token: string
}

export async function getUserByAuth0({ token }: Token): Promise<User> {
  return await request
    .get(`${rootUrl}/users/currentuser`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return res.body.user as User
    })
}

// add user with auth0 ID
interface AddAuth0User {
  userData: UserData
  token: string
}

export function addUserByAuth0({
  userData,
  token,
}: AddAuth0User): Promise<{ id: number }> {
  const { name, class: userClass, gender } = userData

  return request
    .post(`${rootUrl}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name, class: userClass, gender })
    .then((res) => {
      return res.body as { id: number }
    })
}

export async function updateUserByAuth0(
  updates: Partial<Omit<User, 'id' | 'auth_id'>>,
  token: string,
): Promise<number> {
  return await request
    .patch(`${rootUrl}/users/currentuser`)
    .set('Authorization', `Bearer ${token}`)
    .send(updates)
    .then((res) => {
      return res.status
    })
}
