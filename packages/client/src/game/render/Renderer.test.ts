import { Renderer } from './Renderer'

const createMockContext = () =>
  ({
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
  }) as unknown as CanvasRenderingContext2D

describe('Renderer', () => {
  it('clears with a fill color when provided', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.clear('#123456')

    expect(ctx.fillStyle).toBe('#123456')
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50)
    expect(ctx.clearRect).not.toHaveBeenCalled()
  })

  it('clears via clearRect when no color is provided', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.clear()

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 50)
  })

  it('fills a rect with the given color', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.fillRect({ x: 1, y: 2, width: 3, height: 4 }, '#fff')

    expect(ctx.fillStyle).toBe('#fff')
    expect(ctx.fillRect).toHaveBeenCalledWith(1, 2, 3, 4)
  })

  it('strokes a rect with the given color and line width', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.strokeRect({ x: 1, y: 2, width: 3, height: 4 }, '#000', 2)

    expect(ctx.strokeStyle).toBe('#000')
    expect(ctx.lineWidth).toBe(2)
    expect(ctx.strokeRect).toHaveBeenCalledWith(1, 2, 3, 4)
  })

  it('draws a filled circle', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.fillCircle({ x: 10, y: 20 }, 5, '#f00')

    expect(ctx.fillStyle).toBe('#f00')
    expect(ctx.arc).toHaveBeenCalledWith(10, 20, 5, 0, Math.PI * 2)
    expect(ctx.fill).toHaveBeenCalled()
  })

  it('does nothing when drawing a polygon with fewer than 3 points', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.drawPolygon([{ x: 0, y: 0 }])

    expect(ctx.beginPath).not.toHaveBeenCalled()
  })

  it('draws a filled and stroked polygon through all points', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ]

    renderer.drawPolygon(points, '#fff', '#000', 3)

    expect(ctx.moveTo).toHaveBeenCalledWith(0, 0)
    expect(ctx.lineTo).toHaveBeenCalledWith(10, 0)
    expect(ctx.lineTo).toHaveBeenCalledWith(5, 10)
    expect(ctx.closePath).toHaveBeenCalled()
    expect(ctx.fill).toHaveBeenCalled()
    expect(ctx.stroke).toHaveBeenCalled()
    expect(ctx.lineWidth).toBe(3)
  })

  it('draws text with default and custom options', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    renderer.drawText('hi', { x: 1, y: 2 })
    expect(ctx.fillText).toHaveBeenCalledWith('hi', 1, 2)
    expect(ctx.fillStyle).toBe('#1b1b1b')

    renderer.drawText('bye', { x: 3, y: 4 }, { color: '#fff', align: 'center' })
    expect(ctx.fillStyle).toBe('#fff')
    expect(ctx.textAlign).toBe('center')
  })

  it('draws an image using source and destination rects', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)
    const image = {} as CanvasImageSource

    renderer.drawImage(
      image,
      { x: 0, y: 0, width: 16, height: 16 },
      { x: 5, y: 5, width: 32, height: 32 }
    )

    expect(ctx.drawImage).toHaveBeenCalledWith(
      image,
      0,
      0,
      16,
      16,
      5,
      5,
      32,
      32
    )
  })

  it('exposes the underlying context, width and height', () => {
    const ctx = createMockContext()
    const renderer = new Renderer(ctx, 100, 50)

    expect(renderer.context).toBe(ctx)
    expect(renderer.width).toBe(100)
    expect(renderer.height).toBe(50)
  })
})
