import { Animator } from './Animator'
import type { AnimationClip } from './Animator'

const makeClip = (
  frameCount: number,
  loop: boolean,
  fps = 10
): AnimationClip => ({
  frames: Array.from({ length: frameCount }, (_, index) => ({
    x: index,
    y: 0,
    width: 16,
    height: 16,
  })),
  fps,
  loop,
})

describe('Animator', () => {
  it('throws when playing an unregistered clip', () => {
    const animator = new Animator()
    expect(() => animator.play('missing')).toThrow(
      'Animation clip "missing" is not registered'
    )
  })

  it('has no current frame before playing anything', () => {
    const animator = new Animator()
    expect(animator.getCurrentFrame()).toBeNull()
  })

  it('plays a registered clip starting at the first frame', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true))
    animator.play('walk')

    expect(animator.getCurrentFrame()).toEqual({
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    })
  })

  it('advances frames according to elapsed time and fps', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 10))
    animator.play('walk')

    animator.update(0.1)
    expect(animator.getCurrentFrame()).toEqual({
      x: 1,
      y: 0,
      width: 16,
      height: 16,
    })
  })

  it('loops back to the first frame when a looping clip ends', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(2, true, 10))
    animator.play('walk')

    animator.update(0.2)
    expect(animator.getCurrentFrame()).toEqual({
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    })
    expect(animator.isFinished).toBe(false)
  })

  it('stops on the last frame and fires onComplete for non-looping clips', () => {
    const animator = new Animator()
    const onComplete = jest.fn()
    animator.onComplete = onComplete
    animator.addClip('attack', makeClip(2, false, 10))
    animator.play('attack')

    animator.update(0.2)

    expect(animator.isFinished).toBe(true)
    expect(animator.getCurrentFrame()).toEqual({
      x: 1,
      y: 0,
      width: 16,
      height: 16,
    })
    expect(onComplete).toHaveBeenCalledTimes(1)

    animator.update(0.5)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('ignores replaying the same clip unless restart is requested', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 10))
    animator.play('walk')
    animator.update(0.1)
    expect(animator.getCurrentFrame()).toEqual({
      x: 1,
      y: 0,
      width: 16,
      height: 16,
    })

    animator.play('walk')
    expect(animator.getCurrentFrame()).toEqual({
      x: 1,
      y: 0,
      width: 16,
      height: 16,
    })

    animator.play('walk', true)
    expect(animator.getCurrentFrame()).toEqual({
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    })
  })

  it('resets state on stop', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 10))
    animator.play('walk')
    animator.update(0.1)

    animator.stop()

    expect(animator.getCurrentFrame()).toBeNull()
    expect(animator.isFinished).toBe(false)
  })
})
