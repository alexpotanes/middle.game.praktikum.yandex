import type { Game } from './Game'
import type { GameObject } from './GameObject'
import type { InputManager } from '../input/InputManager'
import type { Renderer } from '../render/Renderer'

export abstract class Scene {
  protected game: Game | null = null
  protected objects: GameObject[] = []

  onEnter(game: Game): void {
    this.game = game
  }

  onExit(): void {
    this.game = null
  }

  add<T extends GameObject>(object: T): T {
    this.objects.push(object)
    this.objects.sort((a, b) => a.zIndex - b.zIndex)
    return object
  }

  remove(object: GameObject): void {
    this.objects = this.objects.filter(item => item !== object)
  }

  clearObjects(): void {
    this.objects = []
  }

  update(dt: number, input: InputManager): void {
    for (const object of this.objects) {
      if (object.active) {
        object.update?.(dt, input)
      }
    }
  }

  render(renderer: Renderer): void {
    for (const object of this.objects) {
      if (object.visible) {
        object.render(renderer)
      }
    }
  }
}
