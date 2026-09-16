import type { InputManager } from '../input/InputManager'
import type { Rect } from '../math/Rect'
import type { Vector2 } from '../math/Vector2'
import type { Renderer } from '../render/Renderer'

export abstract class GameObject {
  position: Vector2 = { x: 0, y: 0 }
  zIndex = 0
  visible = true
  active = true

  abstract getBounds(): Rect

  update?(dt: number, input: InputManager): void

  abstract render(renderer: Renderer): void
}
