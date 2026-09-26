import type { WebSocket } from 'ws'
import type { ServerMessage } from '@warchest/shared'
import { MatchSession } from './MatchSession'

interface QueueEntry {
  socket: WebSocket
  login: string
}

export class MatchmakingQueue {
  private waiting: QueueEntry | null = null

  enqueue(socket: WebSocket, login: string): MatchSession | null {
    if (!this.waiting) {
      this.waiting = { socket, login }
      this.send(socket, { type: 'queue.waiting' })
      return null
    }
    const opponent = this.waiting
    this.waiting = null
    return new MatchSession([opponent.login, login], [opponent.socket, socket])
  }

  remove(socket: WebSocket): void {
    if (this.waiting?.socket === socket) {
      this.waiting = null
    }
  }

  private send(socket: WebSocket, message: ServerMessage): void {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }
}
