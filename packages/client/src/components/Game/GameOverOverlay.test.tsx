import { render, screen, fireEvent } from '@testing-library/react'
import type { ButtonHTMLAttributes } from 'react'

jest.mock('../button', () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}))

import { GameOverOverlay } from './GameOverOverlay'

describe('GameOverOverlay', () => {
  it('shows the final score', () => {
    render(
      <GameOverOverlay score={7} onPlayAgain={jest.fn()} onExit={jest.fn()} />
    )

    expect(screen.getByText('7')).not.toBeNull()
  })

  it('calls onPlayAgain when "Играть ещё" is clicked', () => {
    const onPlayAgain = jest.fn()
    const onExit = jest.fn()
    render(
      <GameOverOverlay score={7} onPlayAgain={onPlayAgain} onExit={onExit} />
    )

    fireEvent.click(screen.getByText('Играть ещё'))

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
    expect(onExit).not.toHaveBeenCalled()
  })

  it('calls onExit when "Выйти в меню" is clicked', () => {
    const onPlayAgain = jest.fn()
    const onExit = jest.fn()
    render(
      <GameOverOverlay score={7} onPlayAgain={onPlayAgain} onExit={onExit} />
    )

    fireEvent.click(screen.getByText('Выйти в меню'))

    expect(onExit).toHaveBeenCalledTimes(1)
    expect(onPlayAgain).not.toHaveBeenCalled()
  })
})
