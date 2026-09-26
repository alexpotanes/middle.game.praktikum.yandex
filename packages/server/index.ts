import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({ path: '../../.env' })

import express from 'express'
import http from 'http'
import { sequelize } from './db/sequelize'
import { authRouter } from './routes/auth'
import { oauthRouter } from './routes/oauth'
import { resourcesRouter } from './routes/resources'
import { userRouter } from './routes/user'
import { leaderboardRoutes } from './routes/leaderboard'
import { forumRouter } from './routes/forum'
import { createWsServer } from './ws/wsServer'
import { errorHandler } from './middleware/errorHandler'
import { requireAuth } from './middleware/auth'
import { verifyPraktikumSession } from './services/sessionVerifier'
import { oauthRateLimiter } from './middleware/rateLimiter'
import { themesRouter, userThemeRouter } from './routes/themes'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
const port = Number(process.env.SERVER_PORT) || 3001

const auth = requireAuth(verifyPraktikumSession)

app.use('/auth', authRouter)
app.use('/oauth', oauthRateLimiter, oauthRouter)
app.use('/themes', themesRouter)
app.use('/user/theme', userThemeRouter)
app.use('/user', auth, userRouter)
app.use('/resources', auth, resourcesRouter)
app.use('/forum', auth, forumRouter)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/friends', auth, (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

app.get('/user', auth, (_, res) => {
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

sequelize
  .authenticate()
  .then(() => {
    server.listen(port, () => {
      console.log(`  ➜ Server is listening on port: ${port}`)
    })
  })
  .catch(async error => {
    console.error('Не удалось подключиться к PostgreSQL', error)
    await sequelize.close()
    process.exit(1)
  })
