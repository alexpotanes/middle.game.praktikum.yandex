import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import type { Store } from 'redux'

import { ErrorBoundary } from './components/error-boundary'
import { store as clientStore, type RootState } from './store'

type AppProps = {
  children: ReactNode
  store?: Store<RootState>
}

const App = ({ children, store = clientStore }: AppProps) => (
  <Provider store={store}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </Provider>
)

export default App
