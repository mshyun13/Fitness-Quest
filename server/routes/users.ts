import { Router } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { StatusCodes } from 'http-status-codes'
import * as db from '../db/users.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await db.getAllUsers()
    res.json(users)
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  }
})

router.get('/byAuth0Id/:auth0Id', checkJwt, async (req: JwtRequest, res) => {
  const auth0IdFromParams = req.params.auth0Id
  const authIdFromJwt = req.auth?.sub

  if (!authIdFromJwt || authIdFromJwt !== auth0IdFromParams) {
    console.warn(
      `Unauthorized access attempt for auth0Id: ${auth0IdFromParams} by JWT sub: ${authIdFromJwt}`,
    )
    res.sendStatus(StatusCodes.UNAUTHORIZED)
    return
  }

  try {
    const user = await db.getUserByAuthId(auth0IdFromParams)

    if (user) {
      res.json(user)
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND)
    }
  } catch (err) {
    console.error('Error getting user by Auth0 ID:', err)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to retrieve user by Auth0 ID' })
  }
})

router.get('/currentuser', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED)
    return
  }
  try {
    const user = await db.getUserByAuthId(authId)

    if (user) {
      res.json({ user: user })
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND)
    }
  } catch (err) {
    console.error('Error getting user', err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const auth_id = req.auth?.sub
  if (!auth_id) {
    res.sendStatus(StatusCodes.UNAUTHORIZED)
    return
  }

  try {
    const { name, class: userClass, gender } = req.body
    const newUserId = await db.addUser({
      auth_id,
      name,
      class: userClass,
      gender,
    })

    res.status(StatusCodes.CREATED).json({ id: newUserId })
  } catch (err) {
    console.error('Error adding new user', err)

    if (err instanceof Error && err.message.includes('SQLITE_CONSTRAINT')) {
      res.status(StatusCodes.CONFLICT).json({ message: 'Already a user bro!' })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
})

router.patch('/currentuser', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  if (!authId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED)
    return
  }

  try {
    const updatedRows = await db.updateUserByAuthId(authId, req.body)

    if (updatedRows) {
      res.sendStatus(StatusCodes.OK)
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND)
    }
  } catch (err) {
    console.error('Error updating user', err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

export default router
