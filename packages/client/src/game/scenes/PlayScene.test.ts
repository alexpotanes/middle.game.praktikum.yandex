import { PlayScene } from './PlayScene'
import type { Game } from '../core/Game'
import type { InputManager, MouseState } from '../input/InputManager'
import type { Renderer } from '../render/Renderer'
import type { Vector2 } from '../math/Vector2'

const WIDTH = 800
const HEIGHT = 600

const createFakeGame = (): Game =>
  ({ renderer: { width: WIDTH, height: HEIGHT } }) as unknown as Game

const createFakeRenderer = () => ({
  width: WIDTH,
  height: HEIGHT,
  fillCircle: jest.fn(),
  drawText: jest.fn(),
})

const createFakeInput = (mouse: Partial<MouseState> = {}, clicked = false) =>
  ({
    getMouse: (): MouseState => ({
      position: { x: 0, y: 0 },
      isDown: false,
      justPressed: false,
      justReleased: false,
      ...mouse,
    }),
    wasMouseClicked: () => clicked,
    isKeyDown: () => false,
    wasKeyPressed: () => false,
    wasKeyReleased: () => false,
    endFrame: () => undefined,
  }) as unknown as InputManager

const readTargetPosition = (
  scene: PlayScene,
  renderer: ReturnType<typeof createFakeRenderer>
): Vector2 => {
  scene.render(renderer as unknown as Renderer)
  const [position] =
    renderer.fillCircle.mock.calls[renderer.fillCircle.mock.calls.length - 1]
  return position
}

describe('PlayScene', () => {
  it('places the target within canvas bounds on enter', () => {
    const scene = new PlayScene({ onGameOver: jest.fn() })
    scene.onEnter(createFakeGame())
    const renderer = createFakeRenderer()

    const position = readTargetPosition(scene, renderer)

    expect(position.x).toBeGreaterThanOrEqual(0)
    expect(position.x).toBeLessThanOrEqual(WIDTH)
    expect(position.y).toBeGreaterThanOrEqual(0)
    expect(position.y).toBeLessThanOrEqual(HEIGHT)
  })

  it('increments score and relocates the target when it is clicked', () => {
    const scene = new PlayScene({ onGameOver: jest.fn() })
    scene.onEnter(createFakeGame())
    const renderer = createFakeRenderer()

    const targetPosition = readTargetPosition(scene, renderer)
    const clickInput = createFakeInput(
      { position: targetPosition, isDown: true, justPressed: true },
      true
    )

    scene.update(0.016, clickInput)

    renderer.drawText.mockClear()
    scene.render(renderer as unknown as Renderer)
    expect(renderer.drawText).toHaveBeenCalledWith(
      'Счёт: 1',
      expect.anything(),
      expect.anything()
    )

    const newPosition = readTargetPosition(scene, renderer)
    expect(newPosition).not.toEqual(targetPosition)
  })

  it('does not increase score when the click misses the target', () => {
    const scene = new PlayScene({ onGameOver: jest.fn() })
    scene.onEnter(createFakeGame())
    const renderer = createFakeRenderer()
    const missInput = createFakeInput(
      { position: { x: -1000, y: -1000 }, isDown: true, justPressed: true },
      true
    )

    scene.update(0.016, missInput)
    scene.render(renderer as unknown as Renderer)

    expect(renderer.drawText).toHaveBeenCalledWith(
      'Счёт: 0',
      expect.anything(),
      expect.anything()
    )
  })

  it('calls onGameOver exactly once with the final score when time runs out', () => {
    const onGameOver = jest.fn()
    const scene = new PlayScene({ onGameOver, durationSec: 5 })
    scene.onEnter(createFakeGame())
    const idleInput = createFakeInput()

    scene.update(10, idleInput)
    expect(onGameOver).toHaveBeenCalledTimes(1)
    expect(onGameOver).toHaveBeenCalledWith(0)

    scene.update(1, idleInput)
    expect(onGameOver).toHaveBeenCalledTimes(1)
  })
})
