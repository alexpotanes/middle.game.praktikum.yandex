import { GameLoop } from './GameLoop'
import type { Scene } from './Scene'
import { InputManager } from '../input/InputManager'
import { Renderer } from '../render/Renderer'

export interface GameOptions {
  width?: number
  height?: number
  background?: string
}

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600

export class Game {
  readonly renderer: Renderer
  readonly input: InputManager

  private readonly loop: GameLoop
  private readonly background: string
  private scene: Scene | null = null

  constructor(canvas: HTMLCanvasElement, options: GameOptions = {}) {
    const width = options.width ?? DEFAULT_WIDTH
    const height = options.height ?? DEFAULT_HEIGHT
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context is not available')
    }
    ctx.scale(dpr, dpr)

    this.renderer = new Renderer(ctx, width, height)
    this.input = new InputManager(canvas, width, height)
    this.input.attach()
    this.background = options.background ?? '#000000'
    this.loop = new GameLoop(this.update, this.render)
  }

  setScene(scene: Scene): void {
    this.scene?.onExit()
    this.scene = scene
    scene.onEnter(this)
  }

  start(): void {
    this.loop.start()
  }

  stop(): void {
    this.loop.stop()
  }

  destroy(): void {
    this.loop.stop()
    this.input.detach()
    this.scene?.onExit()
    this.scene = null
  }

  private update = (dt: number): void => {
    this.scene?.update(dt, this.input)
    this.input.endFrame()
  }

  private render = (): void => {
    this.renderer.clear(this.background)
    this.scene?.render(this.renderer)
  }
}
