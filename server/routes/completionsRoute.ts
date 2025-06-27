import { Router } from 'express'
import * as dbCompletions from '../db/completionsDb'
import { /*checkJwt,*/ JwtRequest } from '../auth0'

const router = Router()

// Gets completion and challenge data for a user (/api/v1/completions/:userId)
router.get(
  '/:userId',
  /* checkJwt,*/ async (req: JwtRequest, res) => {
    const userId = Number(req.params.userId)
    // const userId = req.auth?.sub || req.params.userId - Switch to this for Auth0

    if (isNaN(userId) || !userId) {
      console.warn('Unauthorised bro!')
      return res.sendStatus(401)
    }
    try {
      const completions = await dbCompletions.getCompletionsByUserId(userId)
      res.json(completions)
    } catch (error) {
      console.error('Error getting Activity Log', error)
      res.sendStatus(500)
    }
  },
)

// For when adding to DB
router.post(
  '/',
  /* checkJwt,*/ async (req: JwtRequest, res) => {
    const userId = 2
    // const userId = req.auth?.sub - Switch to this for Auth0

    if (!userId) {
      console.warn('Unauthorised bro!')
      return res.sendStatus(401)
    }

    const { challengeId, status } = req.body
    if (!challengeId || !status) {
      console.warn('Missing challengeId or status')
      return res.sendStatus(400)
    }
    try {
      const result = await dbCompletions.processChallengeCompletion(
        userId,
        challengeId,
        status,
      )
      // Return the result which includes completionId, new XP/level, and message
      res.status(201).json(result)
    } catch (error) {
      console.error('Error processing challenge', error)

      if (error instanceof Error) {
        if (
          error.message === 'Challenge not found' ||
          error.message === 'User not found'
        ) {
          return res.status(404).json({ message: error.message })
        }
      }
      res.sendStatus(500)
    }
  },
)

export default router
