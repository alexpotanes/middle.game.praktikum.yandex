export interface Vector2 {
  x: number
  y: number
}

export const vec = (x = 0, y = 0): Vector2 => ({ x, y })

export const add = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

export const subtract = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
})

export const scale = (v: Vector2, factor: number): Vector2 => ({
  x: v.x * factor,
  y: v.y * factor,
})

export const length = (v: Vector2): number => Math.hypot(v.x, v.y)

export const normalize = (v: Vector2): Vector2 => {
  const len = length(v)
  return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len }
}

export const distance = (a: Vector2, b: Vector2): number =>
  Math.hypot(a.x - b.x, a.y - b.y)

export const lerp = (a: Vector2, b: Vector2, t: number): Vector2 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})
