import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import App from './App'
import { router } from './router'
import { store } from './store'
import { GlobalStyle } from './styles/GlobalStyle'
import { fetchCurrentUserThunk } from './thunks/authThunks'
import { startServiceWorker } from './utils/serviceWorker'

store.dispatch(fetchCurrentUserThunk())
startServiceWorker()

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <App store={store}>
    <GlobalStyle />
    <RouterProvider router={router} />
  </App>
)
