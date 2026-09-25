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

const frameX = (animator: Animator) => animator.getCurrentFrame()?.x

describe('Animator', () => {
  it('throws when playing an unregistered clip', () => {
    const animator = new Animator()
    expect(() => animator.play('missing')).toThrow()
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

  it('does not advance before a full frame duration has elapsed', () => {
    // fps=4 - длительность кадра 0.25с, точно представима в двоичной
    // дроби, поэтому проверка не зависит от погрешности округления.
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 4))
    animator.play('walk')

    animator.update(0.125)
    expect(frameX(animator)).toBe(0)
  })

  it('advances one frame once elapsed time reaches the frame duration', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 4))
    animator.play('walk')

    animator.update(0.125)
    animator.update(0.125)
    expect(frameX(animator)).toBe(1)
  })

  it('advances multiple frames in a single update spanning several frame durations', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(4, true, 4))
    animator.play('walk')

    animator.update(0.75)
    expect(frameX(animator)).toBe(3)
  })

  it('carries leftover time over to the next update instead of discarding it', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 4))
    animator.play('walk')

    animator.update(0.375)
    expect(frameX(animator)).toBe(1)

    animator.update(0.125)
    expect(frameX(animator)).toBe(2)
  })

  it('loops back to the first frame when a looping clip ends', () => {
    // fps=4 - длительность кадра 0.25с; dt = 0.5с - ровно два кадра,
    // без погрешности округления.
    const animator = new Animator()
    animator.addClip('walk', makeClip(2, true, 4))
    animator.play('walk')

    animator.update(0.5)
    expect(frameX(animator)).toBe(0)
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
    expect(frameX(animator)).toBe(1)
    expect(onComplete).toHaveBeenCalledTimes(1)

    animator.update(0.5)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('ignores replaying the same clip unless restart is requested', () => {
    const animator = new Animator()
    animator.addClip('walk', makeClip(3, true, 10))
    animator.play('walk')
    animator.update(0.1)
    expect(frameX(animator)).toBe(1)

    animator.play('walk')
    expect(frameX(animator)).toBe(1)

    animator.play('walk', true)
    expect(frameX(animator)).toBe(0)
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
