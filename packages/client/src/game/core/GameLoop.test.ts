import { GameLoop } from './GameLoop'

describe('GameLoop', () => {
  let frameCallback: FrameRequestCallback | null = null
  let now = 0
  let rafSpy: jest.SpyInstance
  let cafSpy: jest.SpyInstance
  let nowSpy: jest.SpyInstance

  beforeEach(() => {
    frameCallback = null
    now = 0
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(cb => {
        frameCallback = cb
        return 1
      })
    cafSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {
        /* noop */
      })
    nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => now)
  })

  afterEach(() => {
    rafSpy.mockRestore()
    cafSpy.mockRestore()
    nowSpy.mockRestore()
  })

  const tick = (time: number) => {
    now = time
    frameCallback?.(time)
  }

  it('is not running until start is called', () => {
    const loop = new GameLoop(jest.fn(), jest.fn())
    expect(loop.isRunning).toBe(false)
  })

  it('schedules a frame and flips isRunning on start', () => {
    const loop = new GameLoop(jest.fn(), jest.fn())
    loop.start()

    expect(loop.isRunning).toBe(true)
    expect(rafSpy).toHaveBeenCalledTimes(1)
  })

  it('calls update with elapsed seconds then render on each frame', () => {
    const onUpdate = jest.fn()
    const onRender = jest.fn()
    const loop = new GameLoop(onUpdate, onRender)

    loop.start()
    tick(0)
    tick(50)

    expect(onUpdate).toHaveBeenLastCalledWith(0.05)
    expect(onRender).toHaveBeenCalledTimes(2)
  })

  it('calls update before render on every frame', () => {
    const callOrder: string[] = []
    const onUpdate = jest.fn(() => callOrder.push('update'))
    const onRender = jest.fn(() => callOrder.push('render'))
    const loop = new GameLoop(onUpdate, onRender)

    loop.start()
    tick(0)
    tick(50)

    expect(callOrder).toEqual(['update', 'render', 'update', 'render'])
  })

  it('clamps large delta times to maxDelta', () => {
    const onUpdate = jest.fn()
    const loop = new GameLoop(onUpdate, jest.fn(), 0.1)

    loop.start()
    tick(0)
    tick(5000)

    expect(onUpdate).toHaveBeenLastCalledWith(0.1)
  })

  it('does not clamp when elapsed time exactly equals maxDelta', () => {
    const onUpdate = jest.fn()
    const loop = new GameLoop(onUpdate, jest.fn(), 0.1)

    loop.start()
    tick(0)
    tick(100) // ровно 0.1с - граница maxDelta

    expect(onUpdate).toHaveBeenLastCalledWith(0.1)
  })

  it('clamps delta times that exceed maxDelta by a small margin', () => {
    const onUpdate = jest.fn()
    const loop = new GameLoop(onUpdate, jest.fn(), 0.1)

    loop.start()
    tick(0)
    tick(101) // чуть выше границы maxDelta

    expect(onUpdate).toHaveBeenLastCalledWith(0.1)
  })

  it('stops the loop and cancels the pending frame', () => {
    const loop = new GameLoop(jest.fn(), jest.fn())
    loop.start()

    loop.stop()

    expect(loop.isRunning).toBe(false)
    expect(cafSpy).toHaveBeenCalledWith(1)
  })

  it('does not tick after being stopped', () => {
    const onUpdate = jest.fn()
    const loop = new GameLoop(onUpdate, jest.fn())

    loop.start()
    loop.stop()
    tick(1000)

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('is idempotent when starting twice', () => {
    const loop = new GameLoop(jest.fn(), jest.fn())
    loop.start()
    loop.start()

    expect(rafSpy).toHaveBeenCalledTimes(1)
    expect(loop.isRunning).toBe(true)

    // Повторный start() во время работы лупа тоже должен быть no-op:
    // новые вызовы rAF планируют только настоящие тики ниже.
    tick(0)
    loop.start()
    tick(50)

    expect(rafSpy).toHaveBeenCalledTimes(3)
  })
})
