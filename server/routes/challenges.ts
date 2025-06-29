import { Router } from 'express'
import * as challengesDb from '../db/challenges'
import * as completionsDb from '../db/completionsDb'
import * as usersDb from '../db/users'
import checkJwt from '../auth0'

const router = Router()

router.get('/', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub

    if (!auth0Id) {
      console.warn('No userId to get Challenges')
      return res.sendStatus(401)
    }

    const dbUser = await usersDb.getUserByAuthId(auth0Id)

    if (!dbUser) {
      console.warn('User not found in DB', auth0Id)
      return res.json([])
    }

    const userId = dbUser.id
    // console.log()

    const allChallenges = await challengesDb.getAllChallenges()
    // console.log()

    const completedChallenges =
      await completionsDb.getChallengesDoneToday(userId)
    // console.log()

    const completedUserId = new Set(completedChallenges)

    const uncompletedChallenges = allChallenges.filter(
      (challenge) => !completedUserId.has(challenge.id), // filters completed challenges based on userId
    )
    // console.log()

    res.json(uncompletedChallenges)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const challenge = await challengesDb.getSingleChallenge(id)
    res.json(challenge)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

export default router
