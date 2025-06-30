import { Router } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import * as db from '../db/sidequests.ts'

const router = Router()

router.get('/:id', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  const id = Number(req.params.id)

  if (!authId) {
    res.sendStatus(401)
    return
  }
  if (id === 0) return

  try {
    const quests = await db.getSideQuestsById(id)
    console.log('routes', quests)
    const reversedQuests = quests.toReversed()
    if (quests) {
      res.json({ sidequests: reversedQuests })
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error('Error getting quests', err)
    res.status(500)
  }
})

router.post('/', async (req, res) => {
  try {
    await db.addSideQuest(req.body.data)
    res.sendStatus(201)
  } catch (err) {
    console.error('Error adding side quest', err)
    res.status(500)
  }
})

export default router
