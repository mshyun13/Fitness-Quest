import { Router } from 'express'
import * as db from '../db/completionsDb'
import { /*checkJwt,*/ JwtRequest } from '../auth0'

const router = Router()

// Gets completion and challenge data for a user (/api/v1/completions/:userId)
router.get(
  '/:userId',
  /* checkJwt,*/ async (req: JwtRequest, res) => {
    const userId = req.params.userId
    // const userId = req.auth?.sub || req.params.userId - Switch to this for Auth0

    if (!userId) {
      console.warn('Unauthorised bro!')
      return res.sendStatus(401)
    }
    try {
      const completions = await db.getCompletionsByUserId(userId)
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
    const userId = 'github|204113180'
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
      const [id] = await db.addCompletion({ userId, challengeId, status })
      res.status(201).json({ id, message: 'Added Successfully' })
    } catch (error) {
      console.error('Error Adding', error)
      res.sendStatus(500)
    }
  },
)

export default router
