import { Scene } from '../core/Scene'
import { GameObject } from '../core/GameObject'
import type { Game } from '../core/Game'
import type { InputManager } from '../input/InputManager'
import { Renderer } from '../render/Renderer'
import { vec } from '../math/Vector2'
import { containsPoint, type Rect } from '../math/Rect'

const TARGET_RADIUS = 18
const TARGET_COLOR = '#c9a24c'
const HUD_COLOR = '#f5f2ef'

interface Bounds {
  width: number
  height: number
}

class Target extends GameObject {
  private readonly radius = TARGET_RADIUS

  constructor(
    private readonly bounds: Bounds,
    private readonly onHit: () => void
  ) {
    super()
    this.relocate()
  }

  private relocate(): void {
    const x =
      this.radius + Math.random() * (this.bounds.width - this.radius * 2)
    const y =
      this.radius + Math.random() * (this.bounds.height - this.radius * 2)
    this.position = vec(x, y)
  }

  getBounds(): Rect {
    return {
      x: this.position.x - this.radius,
      y: this.position.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    }
  }

  update(_dt: number, input: InputManager): void {
    if (!input.wasMouseClicked()) {
      return
    }
    const mouse = input.getMouse()
    if (containsPoint(this.getBounds(), mouse.position)) {
      this.onHit()
      this.relocate()
    }
  }

  render(renderer: Renderer): void {
    renderer.fillCircle(this.position, this.radius, TARGET_COLOR)
  }
}

export interface PlaySceneOptions {
  onGameOver: (score: number) => void
  onTick?: (secondsLeft: number) => void
  durationSec?: number
}

const DEFAULT_DURATION_SEC = 30

export class PlayScene extends Scene {
  private score = 0
  private timeRemaining: number
  private displayedSecondsLeft = 0
  private ended = false

  constructor(private readonly options: PlaySceneOptions) {
    super()
    this.timeRemaining = options.durationSec ?? DEFAULT_DURATION_SEC
  }

  onEnter(game: Game): void {
    super.onEnter(game)
    this.score = 0
    this.ended = false
    this.timeRemaining = this.options.durationSec ?? DEFAULT_DURATION_SEC
    this.clearObjects()

    this.displayedSecondsLeft = Math.ceil(this.timeRemaining)
    this.options.onTick?.(this.displayedSecondsLeft)

    const bounds: Bounds = {
      width: game.renderer.width,
      height: game.renderer.height,
    }
    this.add(new Target(bounds, () => this.handleHit()))
  }

  private handleHit(): void {
    this.score += 1
  }

  update(dt: number, input: InputManager): void {
    if (this.ended) {
      return
    }
    super.update(dt, input)
    this.timeRemaining -= dt
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0
    }

    const secondsLeft = Math.ceil(this.timeRemaining)
    if (secondsLeft !== this.displayedSecondsLeft) {
      this.displayedSecondsLeft = secondsLeft
      this.options.onTick?.(secondsLeft)
    }

    if (this.timeRemaining <= 0) {
      this.ended = true
      this.options.onGameOver(this.score)
    }
  }

  render(renderer: Renderer): void {
    super.render(renderer)
    renderer.drawText(`Счёт: ${this.score}`, vec(16, 24), { color: HUD_COLOR })
  }
}
