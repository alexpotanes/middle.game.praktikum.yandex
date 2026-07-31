import type { Rect } from '../math/Rect'
import type { Vector2 } from '../math/Vector2'

export interface TextOptions {
  color?: string
  font?: string
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
}

export class Renderer {
  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    readonly width: number,
    readonly height: number
  ) {}

  get context(): CanvasRenderingContext2D {
    return this.ctx
  }

  clear(color?: string): void {
    if (color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(0, 0, this.width, this.height)
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }
  }

  fillRect(rect: Rect, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
  }

  strokeRect(rect: Rect, color: string, lineWidth = 1): void {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
  }

  fillCircle(center: Vector2, radius: number, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
    this.ctx.fill()
  }

  drawPolygon(
    points: Vector2[],
    fill?: string,
    stroke?: string,
    lineWidth = 1
  ): void {
    if (points.length < 3) {
      return
    }
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y)
    }
    this.ctx.closePath()
    if (fill) {
      this.ctx.fillStyle = fill
      this.ctx.fill()
    }
    if (stroke) {
      this.ctx.strokeStyle = stroke
      this.ctx.lineWidth = lineWidth
      this.ctx.stroke()
    }
  }

  drawText(text: string, position: Vector2, options: TextOptions = {}): void {
    this.ctx.fillStyle = options.color ?? '#1b1b1b'
    this.ctx.font = options.font ?? '16px sans-serif'
    this.ctx.textAlign = options.align ?? 'left'
    this.ctx.textBaseline = options.baseline ?? 'alphabetic'
    this.ctx.fillText(text, position.x, position.y)
  }

  drawImage(image: CanvasImageSource, source: Rect, dest: Rect): void {
    this.ctx.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      dest.x,
      dest.y,
      dest.width,
      dest.height
    )
  }
}
