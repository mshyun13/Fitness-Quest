import { Router } from 'express'

import * as db from '../db/challenges'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const challenges = await db.getAllChallenges()
    res.json(challenges)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const challenge = await db.getSingleChallenge(id)
    res.json(challenge)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

export default router
