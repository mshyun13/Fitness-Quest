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

  try {
    if (id === 0) {
      res.sendStatus(404)
      return
    }
    const quests = await db.getSideQuestsById(id)
    const reversedQuests = quests.reverse()
    if (quests) {
      res.json({ sidequests: reversedQuests })
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error('Error getting quests', err)
    res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  try {
    await db.addSideQuestXp(req.body.data)
    res.sendStatus(201)
  } catch (err) {
    console.error('Error adding side quest', err)
    res.sendStatus(500)
  }
})

export default router
