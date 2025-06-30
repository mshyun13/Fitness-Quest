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
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/currentuser', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    res.sendStatus(401)
    return
  }
  try {
    const user = await db.getUserByAuthId(authId)

    if (user) {
      res.json({ user: user })
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error('Error getting user', err)
    res.status(500)
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

    res.status(201).json({ id: newUserId })
  } catch (err) {
    console.error('Error adding new user', err)

    if (err instanceof Error && err.message.includes('SQLITE_CONSTRAINT')) {
      res.status(409).json({ message: 'Already a user bro!' })
    } else {
      res.status(500)
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
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error('Error updating user', err)
    res.status(500)
  }
})

export default router
