import { Router } from 'express'
import * as dbCompletions from '../db/completionsDb'
import * as dbUsers from '../db/users'
import { JwtRequest } from '../auth0'
import checkJwt from '../auth0'

const router = Router()

async function getInternalUserId(authId: string): Promise<number | undefined> {
  const user = await dbUsers.getUserByAuthId(authId)
  return user?.id
}

// Gets completion and challenge data for a user (/api/v1/completions/:userId)
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    console.warn('AuthId missing')
    return res.status(401)
  }

  try {
    const userId = await getInternalUserId(authId)

    if (!userId) {
      console.warn('userId missing')
      return res.status(404)
    }
    const completions = await dbCompletions.getCompletionsByUserId(userId)
    res.json(completions)
  } catch (error) {
    console.error('Error getting Activity Log')
    res.sendStatus(500)
  }
})

// For when adding to DB
router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    console.warn('Unauthorised bro!')
    return res.sendStatus(401)
  }

  try {
    const userId = await getInternalUserId(authId)

    if (!userId) {
      console.warn(`User not found in DB for Auth0 ID: ${authId}`)
      return res.status(404).json({ message: 'User not registered in DB' })
    }

    const { challengeId, status } = req.body
    if (!challengeId || !status) {
      console.warn('Missing challengeId')
      return res.sendStatus(400)
    }

    const result = await dbCompletions.processChallengeCompletion(
      userId,
      challengeId,
      status,
    )
    res.status(201).json(result)
  } catch (error) {
    console.error('Error processing challenge:', error)

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
})

export default router
