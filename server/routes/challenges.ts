import { Router } from 'express'
import * as db from '../db/challenges'
import { getChallengesDoneToday } from '../db/completionsDb'
import checkJwt from '../auth0'

const router = Router()

router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.sub

    if (!userId) {
      console.warn('No userId to get Challenges')
      return res.sendStatus(401)
    }

    const completedChallenges = await getChallengesDoneToday(userId)
    const allChallenges = await db.getAllChallenges()

    const completedUserId = new Set(completedChallenges)

    const uncompletedChallenges = allChallenges.filter(
      (challenge) => !completedUserId.has(challenge.id), // filters completed challenges based on userId
    )

    res.json(uncompletedChallenges)
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
