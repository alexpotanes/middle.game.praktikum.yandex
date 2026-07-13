import App from './App'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import friendsReducer from './slices/friendsSlice'
import ssrReducer from './slices/ssrSlice'

const appContent = 'Вот тут будет жить ваше приложение :)'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve('hey') })
)

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      friends: friendsReducer,
      ssr: ssrReducer,
    },
  })
}

test('Example test', async () => {
  const store = createMockStore()
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(screen.getByText(appContent)).toBeDefined()
})
