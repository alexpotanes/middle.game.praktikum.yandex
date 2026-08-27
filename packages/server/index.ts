import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({ path: '../../.env' })

import express from 'express'
import http from 'http'
import { createClientAndConnect } from './db'
import { authRouter } from './routes/auth'
import { oauthRouter } from './routes/oauth'
import { resourcesRouter } from './routes/resources'
import { userRouter } from './routes/user'
import { leaderboardRouter } from './routes/leaderboard'
import { createWsServer } from './ws/wsServer'
import { errorHandler } from './middleware/errorHandler'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.use('/auth', authRouter)
app.use('/oauth', oauthRouter)
app.use('/user', userRouter)
app.use('/resources', resourcesRouter)
app.use('/leaderboard', leaderboardRouter)

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

app.get('/user', (_, res) => {
  res.json({ name: 'Степа', secondName: 'Степанов' })
})

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)')
})

app.use((_, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  })
})

app.use(errorHandler)

const server = http.createServer(app)
createWsServer(server)

server.listen(port, () => {
  console.log(`  ➜ Server is listening on port: ${port}`)
})
