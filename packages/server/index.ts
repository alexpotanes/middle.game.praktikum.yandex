import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config({ path: '../../.env' })

import express from 'express'
import http from 'http'
import { createClientAndConnect } from './db'
import { authRouter } from './routes/auth'
import { resourcesRouter } from './routes/resources'
import { userRouter } from './routes/user'
import { createWsServer } from './ws/wsServer'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/resources', resourcesRouter)

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

const server = http.createServer(app)
createWsServer(server)

server.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
