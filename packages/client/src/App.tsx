import { type ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from './styles/ThemeProvider'

import { ErrorBoundary } from './components/error-boundary'
import { useDispatch, type AppStore } from './store'
import {
  fetchCurrentUserThunk,
  loginWithYandexThunk,
} from './thunks/authThunks'
import {
  extractYandexOAuthCode,
  removeYandexOAuthCodeFromUrl,
} from './utils/oauth'

type AppProps = {
  children: ReactNode
  store: AppStore
}

const AuthBootstrap = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const code = extractYandexOAuthCode(window.location.search)

    if (code) {
      dispatch(loginWithYandexThunk({ code })).then(result => {
        if (loginWithYandexThunk.fulfilled.match(result)) {
          removeYandexOAuthCodeFromUrl()
        }
      })
      return
    }

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
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  </Provider>
)

export default App
