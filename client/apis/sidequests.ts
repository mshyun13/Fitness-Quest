import request from 'superagent'

const rootUrl = '/api/v1'

// get user by auth0 ID
interface UserQuests {
  id: number
  token: string
}

export async function getSideQuestsById({
  id,
  token,
}: UserQuests): Promise<unknown> {
  console.log(id)
  return await request
    .get(`${rootUrl}/sidequests/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      console.log('api', res.body.sidequests)
      return res.body.sidequests
    })
}

interface AddSideQuest {
  data: SideQuestData
  token?: string
}

interface SideQuestData {
  user_id: number
  title: string
  description: string
  attribute: string
  completed_at: string
}

export async function addSideQuest({ data }: AddSideQuest) {
  return await request
    .post(`${rootUrl}/sidequests`)
    .send({ data })
    .then((res) => {
      return res.body
    })
}
