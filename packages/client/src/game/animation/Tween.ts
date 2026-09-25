export type EasingFn = (t: number) => number

export const Easings = {
  linear: (t: number): number => t,
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
} as const

export interface TweenOptions {
  from: number
  to: number
  duration: number
  easing?: EasingFn
  onUpdate: (value: number) => void
  onComplete?: () => void
}

export class Tween {
  private elapsed = 0
  private finished = false

  constructor(private readonly options: TweenOptions) {}

  get isFinished(): boolean {
    return this.finished
  }

  update(dt: number): void {
    if (this.finished) {
      return
    }
    this.elapsed += dt
    const t = Math.min(this.elapsed / this.options.duration, 1)
    const easing = this.options.easing ?? Easings.linear
    const value =
      this.options.from + (this.options.to - this.options.from) * easing(t)
    this.options.onUpdate(value)
    if (t >= 1) {
      this.finished = true
      this.options.onComplete?.()
    }
  }
}

export class TweenManager {
  private tweens: Tween[] = []

  add(tween: Tween): Tween {
    this.tweens.push(tween)
    return tween
  }

  update(dt: number): void {
    for (const tween of this.tweens) {
      tween.update(dt)
    }
    this.tweens = this.tweens.filter(tween => !tween.isFinished)
  }

  clear(): void {
    this.tweens = []
  }
}
