import { Easings, Tween, TweenManager } from './Tween'

describe('Easings', () => {
  it('linear returns the input unchanged', () => {
    expect(Easings.linear(0)).toBe(0)
    expect(Easings.linear(0.5)).toBe(0.5)
    expect(Easings.linear(1)).toBe(1)
  })

  it('easeInOutQuad and easeOutCubic start at 0 and end at 1', () => {
    expect(Easings.easeInOutQuad(0)).toBe(0)
    expect(Easings.easeInOutQuad(1)).toBe(1)
    expect(Easings.easeOutCubic(0)).toBe(0)
    expect(Easings.easeOutCubic(1)).toBe(1)
  })

  it('easeInOutQuad follows the accelerate-then-decelerate quadratic curve', () => {
    expect(Easings.easeInOutQuad(0.25)).toBe(0.125)
    expect(Easings.easeInOutQuad(0.5)).toBe(0.5)
    expect(Easings.easeInOutQuad(0.75)).toBe(0.875)
  })

  it('easeOutCubic follows the decelerating cubic curve', () => {
    expect(Easings.easeOutCubic(0.25)).toBe(0.578125)
    expect(Easings.easeOutCubic(0.5)).toBe(0.875)
    expect(Easings.easeOutCubic(0.75)).toBe(0.984375)
  })
})

describe('Tween', () => {
  it('interpolates value over time using linear easing by default', () => {
    const onUpdate = jest.fn()
    const tween = new Tween({ from: 0, to: 10, duration: 2, onUpdate })

    tween.update(1)
    expect(onUpdate).toHaveBeenLastCalledWith(5)
    expect(tween.isFinished).toBe(false)

    tween.update(1)
    expect(onUpdate).toHaveBeenLastCalledWith(10)
    expect(tween.isFinished).toBe(true)
  })

  it('clamps progress at the target value and calls onComplete once', () => {
    const onUpdate = jest.fn()
    const onComplete = jest.fn()
    const tween = new Tween({
      from: 0,
      to: 10,
      duration: 1,
      onUpdate,
      onComplete,
    })

    tween.update(5)
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenLastCalledWith(10)
    expect(onComplete).toHaveBeenCalledTimes(1)

    tween.update(1)
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('clamps to the target value even when the delta overshoots the duration by orders of magnitude', () => {
    const onUpdate = jest.fn()
    const tween = new Tween({ from: 0, to: 10, duration: 1, onUpdate })

    tween.update(1000)

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenLastCalledWith(10)
    expect(tween.isFinished).toBe(true)
  })

  it('applies a custom easing function', () => {
    const onUpdate = jest.fn()
    const easing = jest.fn(() => 0.25)
    const tween = new Tween({ from: 0, to: 100, duration: 4, easing, onUpdate })

    tween.update(2)

    expect(easing).toHaveBeenCalledTimes(1)
    expect(easing).toHaveBeenCalledWith(0.5)
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith(25)
  })
})

describe('TweenManager', () => {
  it('updates all active tweens', () => {
    const manager = new TweenManager()
    const onUpdateA = jest.fn()
    const onUpdateB = jest.fn()
    manager.add(
      new Tween({ from: 0, to: 10, duration: 10, onUpdate: onUpdateA })
    )
    manager.add(
      new Tween({ from: 0, to: 10, duration: 10, onUpdate: onUpdateB })
    )

    manager.update(1)

    expect(onUpdateA).toHaveBeenCalledTimes(1)
    expect(onUpdateB).toHaveBeenCalledTimes(1)
  })

  it('removes finished tweens after update', () => {
    const manager = new TweenManager()
    const onUpdate = jest.fn()
    const tween = manager.add(
      new Tween({ from: 0, to: 10, duration: 1, onUpdate })
    )

    manager.update(1)
    expect(tween.isFinished).toBe(true)

    manager.update(1)
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('clears all tweens', () => {
    const manager = new TweenManager()
    const onUpdate = jest.fn()
    manager.add(new Tween({ from: 0, to: 10, duration: 10, onUpdate }))

    manager.clear()
    manager.update(1)

    expect(onUpdate).not.toHaveBeenCalled()
  })
})
