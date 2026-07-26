import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import type { Store } from 'redux'

import { store as clientStore, type RootState } from './store'

type AppProps = {
  children: ReactNode
  store?: Store<RootState>
}

const App = ({ children, store = clientStore }: AppProps) => (
  <Provider store={store}>{children}</Provider>
)

export default App
