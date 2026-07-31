import {
  HEX_DIRECTIONS,
  hexCorners,
  hexDistance,
  hexKey,
  hexNeighbor,
  hexToPixel,
  pixelToHex,
} from './hexMath'
import type { AxialCoord } from './hexMath'
import { add, subtract } from '../math/Vector2'
import type { Vector2 } from '../math/Vector2'
import type { Renderer } from '../render/Renderer'

export interface HexCell<T = unknown> {
  coord: AxialCoord
  center: Vector2
  data?: T
}

export interface HexGridOptions {
  size: number
  origin: Vector2
  radius?: number
}

export interface HexPaint {
  fill?: string
  stroke?: string
}

export class HexGrid<T = unknown> {
  readonly size: number
  origin: Vector2

  protected cells = new Map<string, HexCell<T>>()

  constructor(options: HexGridOptions) {
    this.size = options.size
    this.origin = options.origin
    if (options.radius !== undefined) {
      this.generateHexagon(options.radius)
    }
  }

  addCell(coord: AxialCoord, data?: T): HexCell<T> {
    const cell: HexCell<T> = {
      coord,
      center: this.coordToPixel(coord),
      data,
    }
    this.cells.set(hexKey(coord), cell)
    return cell
  }

  getCell(coord: AxialCoord): HexCell<T> | undefined {
    return this.cells.get(hexKey(coord))
  }

  getAllCells(): HexCell<T>[] {
    return [...this.cells.values()]
  }

  coordToPixel(coord: AxialCoord): Vector2 {
    return add(this.origin, hexToPixel(coord, this.size))
  }

  hitTest(point: Vector2): HexCell<T> | null {
    const local = subtract(point, this.origin)
    const coord = pixelToHex(local, this.size)
    return this.getCell(coord) ?? null
  }

  getNeighbors(coord: AxialCoord): HexCell<T>[] {
    return HEX_DIRECTIONS.map(direction => hexNeighbor(coord, direction))
      .map(neighbor => this.getCell(neighbor))
      .filter((cell): cell is HexCell<T> => cell !== undefined)
  }

  getReachable(coord: AxialCoord, range: number): HexCell<T>[] {
    return this.getAllCells().filter(
      cell => hexDistance(coord, cell.coord) <= range
    )
  }

  render(renderer: Renderer, paint?: (cell: HexCell<T>) => HexPaint): void {
    for (const cell of this.cells.values()) {
      const style = paint?.(cell) ?? {}
      renderer.drawPolygon(
        hexCorners(cell.center, this.size),
        style.fill,
        style.stroke ?? '#999999',
        2
      )
    }
  }

  private generateHexagon(radius: number): void {
    for (let q = -radius; q <= radius; q++) {
      const rMin = Math.max(-radius, -q - radius)
      const rMax = Math.min(radius, -q + radius)
      for (let r = rMin; r <= rMax; r++) {
        this.addCell({ q, r })
      }
    }
  }
}
