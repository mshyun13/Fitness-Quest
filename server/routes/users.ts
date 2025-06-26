import { Router } from 'express'
//import checkJwt, { JwtRequest } from '../auth0.ts'
// import { StatusCodes } from 'http-status-codes'
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

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const user = await db.getUserById(id)
    res.json({ user: user })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  // if (!req.auth?.sub) {
  //   res.sendStatus(StatusCodes.UNAUTHORIZED)
  //   return
  // }

  try {
    const id = await db.addUser(req.body)
    // const { auth_id, name, class } = req.body
    // const id = await db.addUser({ auth_id, name, class })
    res.sendStatus(201).json({ id: id })
    // res
    //   .setHeader('Location', `${req.baseUrl}/${id}`)
    //   .sendStatus(StatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  // if (!req.auth?.sub) {
  //   res.sendStatus(StatusCodes.UNAUTHORIZED)
  //   return
  // }

  try {
    const id = await db.updateUser(req.body)
    if (!id) {
      console.log('DB Error: no ID')
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
    // res
    //   .setHeader('Location', `${req.baseUrl}/${id}`)
    //   .sendStatus(StatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
})

export default router
