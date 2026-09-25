import { HexGrid } from './HexGrid'
import { hexDistance } from './hexMath'
import type { Renderer } from '../render/Renderer'

describe('HexGrid', () => {
  it('adds and retrieves cells by axial coord', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 } })
    const cell = grid.addCell({ q: 1, r: -1 }, 'payload')

    expect(grid.getCell({ q: 1, r: -1 })).toBe(cell)
    expect(cell.data).toBe('payload')
    expect(grid.getCell({ q: 5, r: 5 })).toBeUndefined()
  })

  it('generates a hexagonal grid of the given radius', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 }, radius: 1 })
    // A hexagon of radius r has 3r^2 + 3r + 1 cells.
    expect(grid.getAllCells()).toHaveLength(7)
    expect(grid.getCell({ q: 0, r: 0 })).toBeDefined()
  })

  it('converts coords to pixel positions relative to the origin', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 100, y: 50 } })
    expect(grid.coordToPixel({ q: 0, r: 0 })).toEqual({ x: 100, y: 50 })
  })

  it('finds the cell under a pixel via hitTest', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 }, radius: 1 })
    const center = grid.getCell({ q: 0, r: 0 })
    if (!center) {
      throw new Error('expected center cell to exist')
    }

    expect(grid.hitTest(center.center)).toBe(center)
    expect(grid.hitTest({ x: 10000, y: 10000 })).toBeNull()
  })

  it('returns only the neighbors that exist on the grid', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 }, radius: 1 })
    const neighbors = grid.getNeighbors({ q: 0, r: 0 })
    expect(neighbors).toHaveLength(6)

    const edgeNeighbors = grid.getNeighbors({ q: 1, r: 0 })
    expect(edgeNeighbors.length).toBeLessThan(6)
  })

  it('returns cells within a given range for getReachable', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 }, radius: 2 })
    const reachable = grid.getReachable({ q: 0, r: 0 }, 1)
    expect(reachable).toHaveLength(7)
    expect(
      reachable.every(cell => hexDistance({ q: 0, r: 0 }, cell.coord) <= 1)
    ).toBe(true)
  })

  it('renders each cell using the provided paint callback', () => {
    const grid = new HexGrid({ size: 10, origin: { x: 0, y: 0 }, radius: 1 })
    const drawPolygon = jest.fn()
    const renderer = { drawPolygon } as unknown as Renderer

    grid.render(renderer, () => ({ fill: '#fff', stroke: '#000' }))

    expect(drawPolygon).toHaveBeenCalledTimes(7)
    expect(drawPolygon).toHaveBeenCalledWith(
      expect.any(Array),
      '#fff',
      '#000',
      2
    )
  })
})
