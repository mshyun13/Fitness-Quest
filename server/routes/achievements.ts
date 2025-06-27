import { Router } from 'express'
//import checkJwt, { JwtRequest } from '../auth0.ts'
// import { StatusCodes } from 'http-status-codes'
import * as db from '../db/achievements.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const data = await db.getAllAchievements()
    console.log('routes', data)
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// router.get('/:id', async (req, res, next) => {
//   try {
//     const id = Number(req.params.id)
//     const user = await db.getUserById(id)
//     res.json({ user: user })
//   } catch (err) {
//     next(err)
//   }
// })

export default router
