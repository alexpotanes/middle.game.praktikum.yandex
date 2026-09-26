export interface SpriteFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface AnimationClip {
  frames: SpriteFrame[]
  fps: number
  loop: boolean
}

export class Animator {
  private clips = new Map<string, AnimationClip>()
  private currentName: string | null = null
  private current: AnimationClip | null = null
  private time = 0
  private frameIndex = 0
  private finished = false

  onComplete: (() => void) | null = null

  addClip(name: string, clip: AnimationClip): this {
    this.clips.set(name, clip)
    return this
  }

  play(name: string, restart = false): void {
    if (this.currentName === name && !restart) {
      return
    }
    const clip = this.clips.get(name)
    if (!clip) {
      throw new Error(`Animation clip "${name}" is not registered`)
    }
    this.currentName = name
    this.current = clip
    this.time = 0
    this.frameIndex = 0
    this.finished = false
  }

  stop(): void {
    this.currentName = null
    this.current = null
    this.time = 0
    this.frameIndex = 0
    this.finished = false
  }

  get isFinished(): boolean {
    return this.finished
  }

  update(dt: number): void {
    if (!this.current || this.finished) {
      return
    }
    const frameDuration = 1 / this.current.fps
    this.time += dt
    while (this.time >= frameDuration) {
      this.time -= frameDuration
      this.frameIndex += 1
      if (this.frameIndex >= this.current.frames.length) {
        if (this.current.loop) {
          this.frameIndex = 0
        } else {
          this.frameIndex = this.current.frames.length - 1
          this.finished = true
          this.onComplete?.()
          break
        }
      }
    }
  }

  getCurrentFrame(): SpriteFrame | null {
    if (!this.current) {
      return null
    }
    return this.current.frames[this.frameIndex]
  }
}
