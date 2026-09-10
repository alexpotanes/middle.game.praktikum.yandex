import {
  HEX_DIRECTIONS,
  hexCorners,
  hexDistance,
  hexEquals,
  hexKey,
  hexNeighbor,
  hexRound,
  hexToPixel,
  pixelToHex,
} from './hexMath'

describe('hexMath', () => {
  describe('hexKey / hexEquals', () => {
    it('builds a stable string key from an axial coord', () => {
      expect(hexKey({ q: 2, r: -3 })).toBe('2,-3')
    })

    it('reports equal coords as equal', () => {
      expect(hexEquals({ q: 1, r: 2 }, { q: 1, r: 2 })).toBe(true)
      expect(hexEquals({ q: 1, r: 2 }, { q: 2, r: 1 })).toBe(false)
    })
  })

  describe('hexToPixel / pixelToHex', () => {
    it('maps the origin hex to the origin pixel', () => {
      expect(hexToPixel({ q: 0, r: 0 }, 10)).toEqual({ x: 0, y: 0 })
    })

    it('round-trips a hex coord through pixel space', () => {
      const size = 20
      const coords = [
        { q: 0, r: 0 },
        { q: 3, r: -2 },
        { q: -4, r: 5 },
        { q: 1, r: 1 },
      ]
      for (const coord of coords) {
        const pixel = hexToPixel(coord, size)
        expect(pixelToHex(pixel, size)).toEqual(coord)
      }
    })
  })

  describe('hexRound', () => {
    it('rounds fractional cube coords to the nearest valid hex', () => {
      expect(hexRound(0.2, 0.2)).toEqual({ q: 0, r: 0 })
      expect(hexRound(1.6, 0.1)).toEqual({ q: 2, r: 0 })
    })
  })

  describe('hexNeighbor', () => {
    it('offsets a coord by a direction vector', () => {
      expect(hexNeighbor({ q: 0, r: 0 }, { q: 1, r: -1 })).toEqual({
        q: 1,
        r: -1,
      })
    })

    it('has six unique directions', () => {
      const keys = new Set(HEX_DIRECTIONS.map(hexKey))
      expect(keys.size).toBe(6)
    })
  })

  describe('hexDistance', () => {
    it('returns 0 for the same coord', () => {
      expect(hexDistance({ q: 2, r: 3 }, { q: 2, r: 3 })).toBe(0)
    })

    it('returns 1 for adjacent hexes', () => {
      for (const direction of HEX_DIRECTIONS) {
        expect(hexDistance({ q: 0, r: 0 }, direction)).toBe(1)
      }
    })

    it('computes distance for farther hexes', () => {
      expect(hexDistance({ q: 0, r: 0 }, { q: 3, r: -3 })).toBe(3)
      expect(hexDistance({ q: -2, r: 1 }, { q: 2, r: -1 })).toBe(4)
    })
  })

  describe('hexCorners', () => {
    it('returns six corner points around the center', () => {
      const corners = hexCorners({ x: 0, y: 0 }, 10)
      expect(corners).toHaveLength(6)
      for (const corner of corners) {
        expect(Math.hypot(corner.x, corner.y)).toBeCloseTo(10)
      }
    })
  })
})
