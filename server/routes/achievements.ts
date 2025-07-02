import { Router } from 'express'
//import checkJwt, { JwtRequest } from '../auth0.ts'
// import { StatusCodes } from 'http-status-codes'
import * as db from '../db/achievements.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const data = await db.getAllAchievements()
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = await db.getAchievementsById(id)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res) => {
  try {
    // const data = await db.addAchievements(req.body)
    // res.json(data)
    await db.addAchievements(req.body)
    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
