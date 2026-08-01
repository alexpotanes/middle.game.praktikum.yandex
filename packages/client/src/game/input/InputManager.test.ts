import { InputManager } from './InputManager'

const dispatchKey = (
  type: 'keydown' | 'keyup',
  code: string,
  repeat = false
) => {
  const event = new KeyboardEvent(type, { code, repeat })
  jest.spyOn(event, 'preventDefault')
  window.dispatchEvent(event)
  return event
}

const mockCanvasRect = (canvas: HTMLCanvasElement) => {
  jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 200,
    bottom: 100,
    width: 200,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
}

describe('InputManager', () => {
  let canvas: HTMLCanvasElement
  let input: InputManager

  beforeEach(() => {
    canvas = document.createElement('canvas')
    mockCanvasRect(canvas)
    input = new InputManager(canvas, 200, 100)
    input.attach()
  })

  afterEach(() => {
    input.detach()
    jest.restoreAllMocks()
  })

  describe('keyboard', () => {
    it('tracks keys as down and just-pressed on keydown', () => {
      dispatchKey('keydown', 'KeyA')

      expect(input.isKeyDown('KeyA')).toBe(true)
      expect(input.wasKeyPressed('KeyA')).toBe(true)
    })

    it('tracks keys as released on keyup', () => {
      dispatchKey('keydown', 'KeyA')
      dispatchKey('keyup', 'KeyA')

      expect(input.isKeyDown('KeyA')).toBe(false)
      expect(input.wasKeyReleased('KeyA')).toBe(true)
    })

    it('ignores repeated keydown events for justPressed tracking', () => {
      dispatchKey('keydown', 'KeyA')
      input.endFrame()
      dispatchKey('keydown', 'KeyA', true)

      expect(input.isKeyDown('KeyA')).toBe(true)
      expect(input.wasKeyPressed('KeyA')).toBe(false)
    })

    it('prevents default for captured keys', () => {
      const event = dispatchKey('keydown', 'ArrowUp')
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('does not prevent default for uncaptured keys', () => {
      const event = dispatchKey('keydown', 'KeyA')
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('clears just-pressed and just-released state on endFrame', () => {
      dispatchKey('keydown', 'KeyA')
      dispatchKey('keyup', 'KeyA')

      input.endFrame()

      expect(input.wasKeyPressed('KeyA')).toBe(false)
      expect(input.wasKeyReleased('KeyA')).toBe(false)
    })
  })

  describe('mouse', () => {
    it('converts client coordinates to logical canvas coordinates on move', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 100, clientY: 50 })
      )

      expect(input.getMouse().position).toEqual({ x: 100, y: 50 })
    })

    it('marks the mouse as down and just-pressed on left mousedown', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 })
      )

      const mouse = input.getMouse()
      expect(mouse.isDown).toBe(true)
      expect(mouse.justPressed).toBe(true)
      expect(input.wasMouseClicked()).toBe(true)
    })

    it('ignores non-left mouse buttons', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 })
      )

      expect(input.getMouse().isDown).toBe(false)
    })

    it('marks the mouse as released on mouseup', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 })
      )
      window.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))

      const mouse = input.getMouse()
      expect(mouse.isDown).toBe(false)
      expect(mouse.justReleased).toBe(true)
    })

    it('returns a defensive copy from getMouse', () => {
      const mouse = input.getMouse()
      mouse.position.x = 9999

      expect(input.getMouse().position.x).not.toBe(9999)
    })

    it('clears just-pressed/just-released mouse flags on endFrame', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 })
      )

      input.endFrame()

      expect(input.getMouse().justPressed).toBe(false)
    })
  })

  it('stops reacting to events after detach', () => {
    input.detach()
    dispatchKey('keydown', 'KeyA')

    expect(input.isKeyDown('KeyA')).toBe(false)
  })
})
