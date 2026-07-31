import type { Vector2 } from '../math/Vector2'

export interface AxialCoord {
  q: number
  r: number
}

const SQRT3 = Math.sqrt(3)

export const hexKey = (coord: AxialCoord): string => `${coord.q},${coord.r}`

export const hexEquals = (a: AxialCoord, b: AxialCoord): boolean =>
  a.q === b.q && a.r === b.r

export const hexToPixel = (coord: AxialCoord, size: number): Vector2 => ({
  x: size * SQRT3 * (coord.q + coord.r / 2),
  y: size * 1.5 * coord.r,
})

export const pixelToHex = (point: Vector2, size: number): AxialCoord => {
  const q = ((SQRT3 / 3) * point.x - (1 / 3) * point.y) / size
  const r = ((2 / 3) * point.y) / size
  return hexRound(q, r)
}

export const hexRound = (q: number, r: number): AxialCoord => {
  const s = -q - r
  let rq = Math.round(q)
  let rr = Math.round(r)
  const rs = Math.round(s)

  const dq = Math.abs(rq - q)
  const dr = Math.abs(rr - r)
  const ds = Math.abs(rs - s)

  if (dq > dr && dq > ds) {
    rq = -rr - rs
  } else if (dr > ds) {
    rr = -rq - rs
  }

  return { q: rq, r: rr }
}

export const HEX_DIRECTIONS: readonly AxialCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
]

export const hexNeighbor = (
  coord: AxialCoord,
  direction: AxialCoord
): AxialCoord => ({
  q: coord.q + direction.q,
  r: coord.r + direction.r,
})

export const hexDistance = (a: AxialCoord, b: AxialCoord): number =>
  (Math.abs(a.q - b.q) +
    Math.abs(a.r - b.r) +
    Math.abs(a.q + a.r - b.q - b.r)) /
  2

export const hexCorner = (
  center: Vector2,
  size: number,
  index: number
): Vector2 => {
  const angle = (Math.PI / 180) * (60 * index - 30)
  return {
    x: center.x + size * Math.cos(angle),
    y: center.y + size * Math.sin(angle),
  }
}

export const hexCorners = (center: Vector2, size: number): Vector2[] =>
  [0, 1, 2, 3, 4, 5].map(index => hexCorner(center, size, index))
