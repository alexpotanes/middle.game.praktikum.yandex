export { Game } from './core/Game'
export type { GameOptions } from './core/Game'
export { GameLoop } from './core/GameLoop'
export { GameObject } from './core/GameObject'
export { Scene } from './core/Scene'

export { InputManager } from './input/InputManager'
export type { MouseState } from './input/InputManager'

export { Renderer } from './render/Renderer'
export type { TextOptions } from './render/Renderer'

export { intersects, containsPoint, rectCenter } from './math/Rect'
export type { Rect } from './math/Rect'
export {
  vec,
  add,
  subtract,
  scale,
  length,
  normalize,
  distance,
  lerp,
} from './math/Vector2'
export type { Vector2 } from './math/Vector2'

export { HexGrid } from './hex/HexGrid'
export type { HexCell, HexGridOptions, HexPaint } from './hex/HexGrid'
export {
  HEX_DIRECTIONS,
  hexEquals,
  hexDistance,
  hexKey,
  hexNeighbor,
  hexToPixel,
  pixelToHex,
  hexCorners,
} from './hex/hexMath'
export type { AxialCoord } from './hex/hexMath'

export { Animator } from './animation/Animator'
export type { AnimationClip, SpriteFrame } from './animation/Animator'
export { Tween, TweenManager, Easings } from './animation/Tween'
export type { EasingFn, TweenOptions } from './animation/Tween'
