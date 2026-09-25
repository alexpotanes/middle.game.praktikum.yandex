import type { Vector2 } from './Vector2'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export const intersects = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y

export const containsPoint = (rect: Rect, point: Vector2): boolean =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height

export const rectCenter = (rect: Rect): Vector2 => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2,
})
