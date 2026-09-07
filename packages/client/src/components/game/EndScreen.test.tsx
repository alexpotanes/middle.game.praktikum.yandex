import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import type { ButtonHTMLAttributes } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../../slices/userSlice'
import leaderboardReducer from '../../slices/leaderboardSlice'
import type { MatchState } from '@warchest/shared'

const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      leaderboard: leaderboardReducer,
    },
    preloadedState: {
      user: {
        data: {
          id: 11,
          first_name: 'Test',
          second_name: 'User',
          display_name: 'Test User',
          login: 'testuser',
          email: 'test@test.com',
          phone: '+1234567890',
          avatar: null,
        },
      },
      ...preloadedState,
    },
  })
}

jest.mock('../../api/leaderboard-api', () => ({
  submitGameResult: jest.fn().mockResolvedValue(undefined),
  getTeamLeaderboard: jest.fn().mockResolvedValue([]),
}))

jest.mock('../button', () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}))

import { EndScreen } from './EndScreen'

const fakePlayer = (login: string, controlMarkersLeft: number) => ({
  login,
  units: [],
  hand: [],
  bag: [],
  discard: [],
  supply: [],
  controlMarkersLeft,
  passed: false,
})

const fakeMatchState: MatchState = {
  board: {},
  players: [fakePlayer('you', 2), fakePlayer('opponent', 4)],
  activePlayer: 0,
  initiative: 0,
  round: 5,
  winner: 0,
  winReason: 'control',
  rngState: 0,
}

const renderEndScreen = (
  props: Partial<Parameters<typeof EndScreen>[0]> = {},
  storeState = {}
) => {
  const mockStore = createMockStore(storeState)
  render(
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={['/game']}>
        <Routes>
          <Route
            path="/game"
            element={
              <EndScreen
                won
                reason="control"
                matchState={fakeMatchState}
                you={0}
                onPlayAgain={jest.fn()}
                {...props}
              />
            }
          />
          <Route path="/" element={<div>Главная страница</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('EndScreen', () => {
  it('shows the win reason', () => {
    renderEndScreen({ won: true, reason: 'control' })

    expect(screen.getByText(/Победа!/)).not.toBeNull()
  })

  it('calls onPlayAgain when "Сыграть ещё" is clicked', () => {
    const onPlayAgain = jest.fn()
    renderEndScreen({ onPlayAgain })

    fireEvent.click(screen.getByText('Сыграть ещё'))

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  it('navigates to the main page when "Вернуться в главное меню" is clicked', () => {
    renderEndScreen()

    fireEvent.click(screen.getByText('Вернуться в главное меню'))

    expect(screen.getByText('Главная страница')).not.toBeNull()
  })

  it('shows the final score and round number', () => {
    renderEndScreen()

    expect(screen.getByText('4/6')).not.toBeNull()
    expect(screen.getByText('2/6')).not.toBeNull()
    expect(screen.getByText('opponent')).not.toBeNull()
    expect(screen.getByText('Раунд 5')).not.toBeNull()
  })

  it('does not crash without a match state', () => {
    expect(() => renderEndScreen({ matchState: null, you: null })).not.toThrow()
  })
})
