import { render, screen } from '@testing-library/react'

import { SectionTitle } from './index'

describe('SectionTitle', () => {
  it('renders the title', () => {
    render(<SectionTitle title="Hello world" />)

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeTruthy()
  })

  it('does not render an eyebrow or subtitle when they are not provided', () => {
    const { container } = render(<SectionTitle title="Title only" />)

    expect(container.querySelectorAll('span, p')).toHaveLength(0)
  })

  it('renders the eyebrow when provided', () => {
    render(<SectionTitle title="Title" eyebrow="Eyebrow text" />)

    expect(screen.getByText('Eyebrow text')).toBeTruthy()
  })

  it('renders the subtitle when provided', () => {
    render(<SectionTitle title="Title" subtitle="Subtitle text" />)

    expect(screen.getByText('Subtitle text')).toBeTruthy()
  })

  it('renders both eyebrow and subtitle together with the title', () => {
    render(<SectionTitle title="Title" eyebrow="Eyebrow" subtitle="Subtitle" />)

    expect(screen.getByRole('heading', { name: 'Title' })).toBeTruthy()
    expect(screen.getByText('Eyebrow')).toBeTruthy()
    expect(screen.getByText('Subtitle')).toBeTruthy()
  })

  it('accepts a ReactNode as the title', () => {
    render(<SectionTitle title={<span data-testid="custom">Custom</span>} />)

    expect(screen.getByTestId('custom')).toBeTruthy()
  })
})
