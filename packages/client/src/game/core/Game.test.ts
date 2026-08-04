import { Game } from './Game'
import { Scene } from './Scene'
import { InputManager } from '../input/InputManager'

const createMockContext = () => {
  const context: Partial<CanvasRenderingContext2D> = {
    scale: jest.fn(),
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
  }
  return context as CanvasRenderingContext2D
}

class TestScene extends Scene {
  onEnter = jest.fn()
  onExit = jest.fn()
  update = jest.fn()
  render = jest.fn()
}

const createCanvas = () => {
  const canvas = document.createElement('canvas')
  jest.spyOn(canvas, 'getContext').mockReturnValue(createMockContext())
  return canvas
}

describe('Game', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws if the canvas does not support a 2d context', () => {
    const canvas = document.createElement('canvas')
    jest.spyOn(canvas, 'getContext').mockReturnValue(null)

    expect(() => new Game(canvas)).toThrow('Canvas 2D context is not available')
  })

  it('sizes the canvas using the given options and device pixel ratio', () => {
    const originalDpr = window.devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 2,
      configurable: true,
    })

    try {
      const canvas = createCanvas()

      const game = new Game(canvas, { width: 400, height: 300 })

      expect(canvas.width).toBe(800)
      expect(canvas.height).toBe(600)
      expect(canvas.style.width).toBe('400px')
      expect(canvas.style.height).toBe('300px')
      expect(game.renderer.width).toBe(400)
      expect(game.renderer.height).toBe(300)
    } finally {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: originalDpr,
        configurable: true,
      })
    }
  })

  it('falls back to default dimensions when none are provided', () => {
    const canvas = createCanvas()
    const game = new Game(canvas)

    expect(game.renderer.width).toBe(800)
    expect(game.renderer.height).toBe(600)
  })

  it('attaches its input manager on construction', () => {
    const canvas = createCanvas()
    const game = new Game(canvas)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))

    expect(game.input.isKeyDown('KeyA')).toBe(true)
  })

  it('switches scenes, exiting the previous one and entering the next', () => {
    const canvas = createCanvas()
    const game = new Game(canvas)
    const first = new TestScene()
    const second = new TestScene()

    game.setScene(first)
    expect(first.onEnter).toHaveBeenCalledWith(game)

    game.setScene(second)
    expect(first.onExit).toHaveBeenCalledTimes(1)
    expect(second.onEnter).toHaveBeenCalledWith(game)
  })

  it('destroy stops the loop, detaches input, and exits the active scene', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
    const cancelSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {
        /* noop */
      })
    const detachSpy = jest.spyOn(InputManager.prototype, 'detach')
    const canvas = createCanvas()
    const game = new Game(canvas)
    const scene = new TestScene()
    game.setScene(scene)

    game.start()
    game.destroy()

    expect(cancelSpy).toHaveBeenCalledWith(1)
    expect(detachSpy).toHaveBeenCalledTimes(1)
    expect(scene.onExit).toHaveBeenCalledTimes(1)
  })

  describe('game loop integration', () => {
    let frameCallback: FrameRequestCallback | null = null

    beforeEach(() => {
      frameCallback = null
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
        frameCallback = cb
        return 1
      })
      jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        /* noop */
      })
      jest.spyOn(performance, 'now').mockReturnValue(0)
    })

    it('drives the active scene update and render loop on start', () => {
      const canvas = createCanvas()
      const game = new Game(canvas)
      const scene = new TestScene()
      game.setScene(scene)

      game.start()
      frameCallback?.(16)

      expect(scene.update).toHaveBeenCalled()
      expect(scene.render).toHaveBeenCalledWith(game.renderer)
    })
  })
})
