import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import type { ButtonHTMLAttributes } from 'react'

jest.mock('../components/button', () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}))

import { reducer, RootState } from '../store'
import { GameState } from '../slices/gameSlice'
import { GamePage } from './GamePage'

const buildStore = (game: GameState) =>
  configureStore({ reducer, preloadedState: { game } as Partial<RootState> })

const renderGamePage = (game: GameState) =>
  render(
    <Provider store={buildStore(game)}>
      <MemoryRouter initialEntries={['/game']}>
        <Routes>
          <Route path="/game" element={<GamePage />} />
          <Route path="/" element={<div>Главная страница</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

const createFakeContext = () =>
  ({
    scale: jest.fn(),
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
  }) as unknown as CanvasRenderingContext2D

describe('GamePage', () => {
  beforeEach(() => {
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(createFakeContext())
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)
    jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows the start overlay by default', () => {
    const { container } = renderGamePage({ screen: 'start', score: 0 })

    expect(screen.getByText('Начать игру')).not.toBeNull()
    expect(container.querySelector('canvas')).not.toBeNull()
  })

  it('hides the start overlay once the game begins', () => {
    renderGamePage({ screen: 'start', score: 0 })

    fireEvent.click(screen.getByText('Начать игру'))

    expect(screen.queryByText('Начать игру')).toBeNull()
  })

  it('shows the final score and lets the user play again', () => {
    renderGamePage({ screen: 'gameover', score: 12 })

    expect(screen.getByText('12')).not.toBeNull()

    fireEvent.click(screen.getByText('Играть ещё'))

    expect(screen.queryByText('Играть ещё')).toBeNull()
  })

  it('navigates to the main page on exit', () => {
    renderGamePage({ screen: 'gameover', score: 12 })

    fireEvent.click(screen.getByText('Выйти в меню'))

    expect(screen.getByText('Главная страница')).not.toBeNull()
  })

  it('lets the user exit early while playing, without waiting for the round to end', () => {
    renderGamePage({ screen: 'start', score: 0 })

    fireEvent.click(screen.getByText('Начать игру'))
    expect(screen.getByText('Выйти')).not.toBeNull()

    fireEvent.click(screen.getByText('Выйти'))

    expect(screen.getByText('Главная страница')).not.toBeNull()
  })

  it('shows the timer next to the exit button while playing', () => {
    renderGamePage({ screen: 'start', score: 0 })

    fireEvent.click(screen.getByText('Начать игру'))

    const exitButton = screen.getByText('Выйти')
    const timer = screen.getByText('30 с')

    expect(timer.parentElement).toBe(exitButton.parentElement)
  })

  it('unmounts cleanly without throwing', () => {
    const { unmount } = renderGamePage({ screen: 'start', score: 0 })

    expect(() => unmount()).not.toThrow()
  })
})
