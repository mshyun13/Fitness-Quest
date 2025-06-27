import { Router } from 'express'
import * as db from '../db/challenges'
import { getChallengesDoneToday } from '../db/completionsDb'
// import checkJwt from '../auth0'

const router = Router()

router.get(
  '/',
  /*checkJwt*/ async (req, res) => {
    try {
      // const userId = req.auth?.sub
      const userId = 2

      if (!userId) return res.sendStatus(401)

      const allChallenges = await db.getAllChallenges()
      const completedChallenges = await getChallengesDoneToday(Number(userId))

      const uncompletedChallenges = allChallenges.filter(
        (challenge) => !completedChallenges.includes(challenge.id),
      )

      res.json(uncompletedChallenges)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong!' })
    }
  },
)

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
