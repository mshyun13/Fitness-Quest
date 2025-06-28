import express from 'express'
import * as db from '../db/authUser'
import checkJwt from '../auth0'
import { JwtRequest } from '../auth0'

const router = express.Router()

router.get('/', checkJwt, async (req: JwtRequest, res, next) => {
  try {
    const auth_id = String(req.auth?.sub)
    const user = await db.getUserByAuth(auth_id)
    if (typeof user == 'undefined') {
      return res.sendStatus(404)
    } else {
      return res.json(user)
    }
  } catch (e) {
    // res.status(500).send('Something went wrong')
    next(e)
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res, next) => {
  try {
    const auth_id = String(req.auth?.sub)
    const user = { ...req.body, auth_id: auth_id }
    await db.createUser(user)
    res.sendStatus(201)
  } catch (e) {
    // res.status(500).send('Something went wrong')
    next(e)
  }
})

export default router
