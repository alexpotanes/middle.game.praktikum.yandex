import { render, screen } from '@testing-library/react'

import { SectionTitle } from './index'

describe('SectionTitle', () => {
  it('renders the title', () => {
    render(<SectionTitle title="Hello world" />)

    expect(
      screen.getByRole('heading', { name: 'Hello world' })
    ).toBeInTheDocument()
  })

  it('does not render an eyebrow or subtitle when they are not provided', () => {
    render(<SectionTitle title="Title only" />)

    expect(screen.queryByText('Eyebrow text')).not.toBeInTheDocument()
    expect(screen.queryByText('Subtitle text')).not.toBeInTheDocument()
  })

  it('renders the eyebrow when provided', () => {
    render(<SectionTitle title="Title" eyebrow="Eyebrow text" />)

    expect(screen.getByText('Eyebrow text')).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(<SectionTitle title="Title" subtitle="Subtitle text" />)

    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('renders both eyebrow and subtitle together with the title', () => {
    render(<SectionTitle title="Title" eyebrow="Eyebrow" subtitle="Subtitle" />)

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('Eyebrow')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  it('accepts a ReactNode as the title', () => {
    render(<SectionTitle title={<span>Custom</span>} />)

    expect(screen.getByRole('heading', { name: 'Custom' })).toBeInTheDocument()
  })
})
