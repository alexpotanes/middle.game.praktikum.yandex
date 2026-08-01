import { GameObject } from './GameObject'
import { Scene } from './Scene'
import type { InputManager } from '../input/InputManager'
import type { Rect } from '../math/Rect'
import type { Renderer } from '../render/Renderer'

class TestScene extends Scene {}

class FakeGameObject extends GameObject {
  update = jest.fn()
  render = jest.fn()

  getBounds(): Rect {
    return { x: 0, y: 0, width: 1, height: 1 }
  }
}

describe('Scene', () => {
  it('adds objects and returns the same instance', () => {
    const scene = new TestScene()
    const object = new FakeGameObject()

    expect(scene.add(object)).toBe(object)
  })

  it('keeps objects sorted by zIndex after adding', () => {
    const scene = new TestScene()
    const back = new FakeGameObject()
    back.zIndex = 5
    const front = new FakeGameObject()
    front.zIndex = 1

    scene.add(back)
    scene.add(front)

    // front (zIndex 1) should render before back (zIndex 5).
    const renderOrder: FakeGameObject[] = []
    front.render.mockImplementation(() => renderOrder.push(front))
    back.render.mockImplementation(() => renderOrder.push(back))

    scene.render({} as Renderer)

    expect(renderOrder).toEqual([front, back])
  })

  it('removes an object from the scene', () => {
    const scene = new TestScene()
    const object = new FakeGameObject()
    scene.add(object)

    scene.remove(object)
    scene.update(1, {} as InputManager)

    expect(object.update).not.toHaveBeenCalled()
  })

  it('clears all objects', () => {
    const scene = new TestScene()
    const object = new FakeGameObject()
    scene.add(object)

    scene.clearObjects()
    scene.render({} as Renderer)

    expect(object.render).not.toHaveBeenCalled()
  })

  it('only updates active objects', () => {
    const scene = new TestScene()
    const active = new FakeGameObject()
    const inactive = new FakeGameObject()
    inactive.active = false
    scene.add(active)
    scene.add(inactive)

    const input = {} as InputManager
    scene.update(0.5, input)

    expect(active.update).toHaveBeenCalledWith(0.5, input)
    expect(inactive.update).not.toHaveBeenCalled()
  })

  it('only renders visible objects', () => {
    const scene = new TestScene()
    const visible = new FakeGameObject()
    const hidden = new FakeGameObject()
    hidden.visible = false
    scene.add(visible)
    scene.add(hidden)

    const renderer = {} as Renderer
    scene.render(renderer)

    expect(visible.render).toHaveBeenCalledWith(renderer)
    expect(hidden.render).not.toHaveBeenCalled()
  })
})
