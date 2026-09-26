type UpdateCallback = (dt: number) => void
type RenderCallback = () => void

export class GameLoop {
  private rafId: number | null = null
  private lastTime = 0
  private running = false

  constructor(
    private readonly onUpdate: UpdateCallback,
    private readonly onRender: RenderCallback,
    private readonly maxDelta = 0.1
  ) {}

  get isRunning(): boolean {
    return this.running
  }

  start(): void {
    if (this.running) {
      return
    }
    this.running = true
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    if (!this.running) {
      return
    }
    this.running = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private tick = (time: number): void => {
    if (!this.running) {
      return
    }
    const dt = Math.min((time - this.lastTime) / 1000, this.maxDelta)
    this.lastTime = time

    this.onUpdate(dt)
    this.onRender()

    this.rafId = requestAnimationFrame(this.tick)
  }
}
