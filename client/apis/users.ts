import request from 'superagent'
import { User, UserData } from '../../models/users'

const rootUrl = '/api/v1'

export function getAllUsers(): Promise<User[]> {
  return request.get(rootUrl + '/users').then((res) => {
    return res.body
  })
}

// get user by auth0 ID
interface GetUserByAuth0Params {
  token: string
  auth0Id: string
}

export async function getUserByAuth0({
  token,
  auth0Id,
}: GetUserByAuth0Params): Promise<User> {
  return await request
    .get(`${rootUrl}/users/byAuth0Id/${auth0Id}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return res.body as User
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

export function getLeaderboard(): Promise<User[]> {
  return request.get(rootUrl + '/users').then((res) => {
    const users = res.body
    const leaderboard = users.sort((a: User, b: User) => a.level - b.level)
    return leaderboard.reverse().slice(0, 3) as User[]
  })
}
