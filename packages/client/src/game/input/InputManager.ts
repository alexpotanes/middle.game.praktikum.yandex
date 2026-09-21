import type { Vector2 } from '../math/Vector2'

export interface MouseState {
  position: Vector2
  isDown: boolean
  justPressed: boolean
  justReleased: boolean
}

const DEFAULT_CAPTURED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
]

export class InputManager {
  private keysDown = new Set<string>()
  private keysPressed = new Set<string>()
  private keysReleased = new Set<string>()

  private readonly mouse: MouseState = {
    position: { x: 0, y: 0 },
    isDown: false,
    justPressed: false,
    justReleased: false,
  }

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly logicalWidth: number,
    private readonly logicalHeight: number,
    private readonly capturedKeys: string[] = DEFAULT_CAPTURED_KEYS
  ) {}

  attach(): void {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  detach(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  isKeyDown(code: string): boolean {
    return this.keysDown.has(code)
  }

  wasKeyPressed(code: string): boolean {
    return this.keysPressed.has(code)
  }

  wasKeyReleased(code: string): boolean {
    return this.keysReleased.has(code)
  }

  getMouse(): MouseState {
    return { ...this.mouse, position: { ...this.mouse.position } }
  }

  wasMouseClicked(): boolean {
    return this.mouse.justPressed
  }

  endFrame(): void {
    this.keysPressed.clear()
    this.keysReleased.clear()
    this.mouse.justPressed = false
    this.mouse.justReleased = false
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.capturedKeys.includes(event.code)) {
      event.preventDefault()
    }
    if (event.repeat) {
      return
    }
    this.keysDown.add(event.code)
    this.keysPressed.add(event.code)
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keysDown.delete(event.code)
    this.keysReleased.add(event.code)
  }

  private handleMouseMove = (event: MouseEvent): void => {
    this.mouse.position = this.toLogical(event)
  }

  private handleMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) {
      return
    }
    this.mouse.position = this.toLogical(event)
    this.mouse.isDown = true
    this.mouse.justPressed = true
  }

  private handleMouseUp = (event: MouseEvent): void => {
    if (event.button !== 0) {
      return
    }
    this.mouse.isDown = false
    this.mouse.justReleased = true
  }

  private toLogical(event: MouseEvent): Vector2 {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.logicalWidth / rect.width
    const scaleY = this.logicalHeight / rect.height
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }
}
