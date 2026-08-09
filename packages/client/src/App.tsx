import { type ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'

import { ErrorBoundary } from './components/error-boundary'
import { useDispatch, type AppStore } from './store'
import { fetchCurrentUserThunk } from './thunks/authThunks'

type AppProps = {
  children: ReactNode
  store: AppStore
}

const AuthBootstrap = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const task = dispatch(fetchCurrentUserThunk())

    return () => {
      task.abort()
    }
  }, [dispatch])

  return null
}

const App = ({ children, store }: AppProps) => (
  <Provider store={store}>
    <ErrorBoundary>
      <AuthBootstrap />
      {children}
    </ErrorBoundary>
  </Provider>
)

export default App
