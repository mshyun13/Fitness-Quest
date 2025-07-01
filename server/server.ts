import express from 'express'
import * as Path from 'node:path'
import userRoutes from './routes/users.ts'
import completionsRoute from './routes/completionsRoute.ts'
import challengesRoutes from './routes/challenges'
import achievementsRoutes from './routes/achievements.ts'
import authUserRoutes from './routes/authUser.ts'
import sidequestRoutes from './routes/sidequests.ts'
import postRoutes from './routes/posts.ts'
const server = express()

server.use(express.json())

server.use('/api/v1/users', userRoutes)
server.use('/api/v1/completions', completionsRoute)
server.use('/api/v1/challenges', challengesRoutes)
server.use('/api/v1/achievements', achievementsRoutes)
server.use('/api/v1/sidequests', sidequestRoutes)
server.use('/api/v1/authuser', authUserRoutes)
server.use('/api/v1/posts', postRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
