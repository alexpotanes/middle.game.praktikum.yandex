import { render, screen, fireEvent } from '@testing-library/react'
import type { ButtonHTMLAttributes } from 'react'

jest.mock('../button', () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}))

import { StartOverlay } from './StartOverlay'

describe('StartOverlay', () => {
  it('calls onStart when the start button is clicked', () => {
    const onStart = jest.fn()
    render(<StartOverlay onStart={onStart} />)

    fireEvent.click(screen.getByText('Начать игру'))

    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
