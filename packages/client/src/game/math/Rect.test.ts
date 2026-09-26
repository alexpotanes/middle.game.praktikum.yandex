import { containsPoint, intersects, rectCenter } from './Rect'
import type { Rect } from './Rect'

describe('Rect', () => {
  const rect: Rect = { x: 0, y: 0, width: 10, height: 10 }

  describe('intersects', () => {
    it('returns true for overlapping rects', () => {
      const other: Rect = { x: 5, y: 5, width: 10, height: 10 }
      expect(intersects(rect, other)).toBe(true)
    })

    it('returns false for rects that do not overlap', () => {
      const other: Rect = { x: 20, y: 20, width: 5, height: 5 }
      expect(intersects(rect, other)).toBe(false)
    })

    it('returns false for rects that only touch at an edge', () => {
      const other: Rect = { x: 10, y: 0, width: 10, height: 10 }
      expect(intersects(rect, other)).toBe(false)
    })
  })

  describe('containsPoint', () => {
    it('returns true for a point inside the rect', () => {
      expect(containsPoint(rect, { x: 5, y: 5 })).toBe(true)
    })

    it('returns true for a point on the boundary', () => {
      expect(containsPoint(rect, { x: 10, y: 10 })).toBe(true)
      expect(containsPoint(rect, { x: 0, y: 0 })).toBe(true)
    })

    it('returns false for a point outside the rect', () => {
      expect(containsPoint(rect, { x: 11, y: 5 })).toBe(false)
      expect(containsPoint(rect, { x: -1, y: 5 })).toBe(false)
    })
  })

  describe('rectCenter', () => {
    it('computes the center point of a rect', () => {
      expect(rectCenter(rect)).toEqual({ x: 5, y: 5 })
      expect(rectCenter({ x: 10, y: 20, width: 4, height: 8 })).toEqual({
        x: 12,
        y: 24,
      })
    })
  })
})
