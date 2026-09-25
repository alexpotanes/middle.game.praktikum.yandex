import {
  add,
  distance,
  length,
  lerp,
  normalize,
  scale,
  subtract,
  vec,
} from './Vector2'

describe('Vector2', () => {
  it('vec creates a vector with defaults of 0', () => {
    expect(vec()).toEqual({ x: 0, y: 0 })
    expect(vec(3, 4)).toEqual({ x: 3, y: 4 })
  })

  it('adds two vectors component-wise', () => {
    expect(add(vec(1, 2), vec(3, 4))).toEqual({ x: 4, y: 6 })
  })

  it('subtracts two vectors component-wise', () => {
    expect(subtract(vec(5, 7), vec(2, 3))).toEqual({ x: 3, y: 4 })
  })

  it('scales a vector by a factor', () => {
    expect(scale(vec(2, 3), 2)).toEqual({ x: 4, y: 6 })
    expect(scale(vec(2, 3), 0)).toEqual({ x: 0, y: 0 })
  })

  it('computes the length of a vector', () => {
    expect(length(vec(3, 4))).toBe(5)
    expect(length(vec(0, 0))).toBe(0)
  })

  it('normalizes a non-zero vector to unit length', () => {
    const result = normalize(vec(3, 4))
    expect(result.x).toBeCloseTo(0.6)
    expect(result.y).toBeCloseTo(0.8)
    expect(length(result)).toBeCloseTo(1)
  })

  it('normalizes the zero vector to the zero vector', () => {
    expect(normalize(vec(0, 0))).toEqual({ x: 0, y: 0 })
  })

  it('computes the distance between two vectors', () => {
    expect(distance(vec(0, 0), vec(3, 4))).toBe(5)
  })

  it('interpolates linearly between two vectors', () => {
    expect(lerp(vec(0, 0), vec(10, 20), 0)).toEqual({ x: 0, y: 0 })
    expect(lerp(vec(0, 0), vec(10, 20), 1)).toEqual({ x: 10, y: 20 })
    expect(lerp(vec(0, 0), vec(10, 20), 0.5)).toEqual({ x: 5, y: 10 })
  })
})
