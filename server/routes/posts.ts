import { Router } from 'express'
import checkJwt from '../auth0.ts'

import * as db from '../db/posts.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const posts = await db.getAllPosts()
    console.log('route posts', posts)
    if (posts === undefined) {
      res.status(500)
    }
    res.json(posts).status(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error loading posts' })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log('route', req.body)
    const result = await db.addPost(req.body)
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error loading posts' })
  }
})

export default router
