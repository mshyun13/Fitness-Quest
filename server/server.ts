import express from 'express'
import * as Path from 'node:path'

<<<<<<< HEAD
import fruitRoutes from './routes/fruits.ts'
import userRoutes from './routes/users.ts'
=======
import completionsRoute from './routes/completionsRoute.ts'
import challengesRoutes from './routes/challenges'
>>>>>>> b390fa5f1ce21671e5e9b17ffb0c24b4233238e5

const server = express()

server.use(express.json())

<<<<<<< HEAD
//server.use('/api/v1/fruits', fruitRoutes)
server.use('/api/v1/users', userRoutes)
=======
server.use('/api/v1/completions', completionsRoute)
server.use('/api/v1/challenges', challengesRoutes)
>>>>>>> b390fa5f1ce21671e5e9b17ffb0c24b4233238e5

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
