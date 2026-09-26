import { GameObject } from './GameObject'
import { Scene } from './Scene'
import type { InputManager } from '../input/InputManager'
import type { Rect } from '../math/Rect'
import { Renderer } from '../render/Renderer'

// Scene объявлен abstract, хотя абстрактных методов у него нет, поэтому
// для инстанцирования в тестах нужен минимальный подкласс.
class TestScene extends Scene {}

class FakeGameObject extends GameObject {
  update = jest.fn()
  render = jest.fn()

  getBounds(): Rect {
    return { x: 0, y: 0, width: 1, height: 1 }
  }
}

const createFakeRenderer = (): Renderer => {
  const ctx: Partial<CanvasRenderingContext2D> = {}
  return new Renderer(ctx as CanvasRenderingContext2D, 100, 100)
}

describe('Scene', () => {
  it('adds objects and returns the same instance', () => {
    const scene = new TestScene()
    const object = new FakeGameObject()

    expect(scene.add(object)).toBe(object)
  })

  it('keeps objects sorted by zIndex, including insertion between existing objects', () => {
    const scene = new TestScene()
    const first = new FakeGameObject()
    first.zIndex = 1
    const second = new FakeGameObject()
    second.zIndex = 5
    const third = new FakeGameObject()
    third.zIndex = 3

    scene.add(first)
    scene.add(second)
    scene.add(third)

    const renderOrder: FakeGameObject[] = []
    for (const object of [first, second, third]) {
      object.render.mockImplementation(() => renderOrder.push(object))
    }

    scene.render(createFakeRenderer())

    expect(renderOrder).toEqual([first, third, second])
  })

  it('preserves insertion order for objects with equal zIndex', () => {
    const scene = new TestScene()
    const a = new FakeGameObject()
    const b = new FakeGameObject()
    const c = new FakeGameObject()

    scene.add(a)
    scene.add(b)
    scene.add(c)

    const renderOrder: FakeGameObject[] = []
    for (const object of [a, b, c]) {
      object.render.mockImplementation(() => renderOrder.push(object))
    }

    scene.render(createFakeRenderer())

    expect(renderOrder).toEqual([a, b, c])
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
    scene.render(createFakeRenderer())

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

    expect(active.update).toHaveBeenCalledTimes(1)
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

    const renderer = createFakeRenderer()
    scene.render(renderer)

    expect(visible.render).toHaveBeenCalledTimes(1)
    expect(visible.render).toHaveBeenCalledWith(renderer)
    expect(hidden.render).not.toHaveBeenCalled()
  })
})
