import type { Server } from 'http'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { ClientMessage } from '@warchest/shared'
import { MatchmakingQueue } from './MatchmakingQueue'
import type { MatchSession } from './MatchSession'

export const createWsServer = (server: Server): void => {
  const wss = new WebSocketServer({ server, path: '/ws' })
  const queue = new MatchmakingQueue()
  const sessions = new Map<WebSocket, MatchSession>()

  const registerSession = (session: MatchSession): void => {
    for (const socket of wss.clients) {
      if (session.playerIndexOf(socket) !== null) {
        sessions.set(socket, session)
      }
    }
  }

  wss.on('connection', socket => {
    socket.on('message', raw => {
      let message: ClientMessage
      try {
        message = JSON.parse(raw.toString()) as ClientMessage
      } catch {
        return
      }
      switch (message.type) {
        case 'queue.join': {
          if (sessions.has(socket)) {
            return
          }
          const session = queue.enqueue(socket, message.login)
          if (session) {
            registerSession(session)
            session.start()
          }
          break
        }
        case 'queue.leave':
          queue.remove(socket)
          break
        case 'draft.pick':
          sessions.get(socket)?.handleDraftPick(socket, message.unit)
          break
        case 'match.action':
          sessions
            .get(socket)
            ?.handleAction(socket, message.seq, message.action)
          break
        case 'match.resign':
          sessions.get(socket)?.handleResign(socket)
          break
      }
    })

    socket.on('close', () => {
      queue.remove(socket)
      const session = sessions.get(socket)
      if (session) {
        sessions.delete(socket)
        session.handleDisconnect(socket)
      }
    })
  })
}
