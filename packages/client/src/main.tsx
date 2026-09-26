import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import App from './App'
import { router } from './router'
import { createAppStore } from './store'
import { GlobalStyle } from './styles/GlobalStyle'
import { startServiceWorker } from './utils/serviceWorker'

const store = createAppStore(window.APP_INITIAL_STATE)

startServiceWorker()

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <App store={store}>
    <GlobalStyle />
    <RouterProvider router={router} />
  </App>
)
