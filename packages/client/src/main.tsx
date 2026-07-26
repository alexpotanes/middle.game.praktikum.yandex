import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import App from './App'
import { router } from './router'
import { store } from './store'
import { fetchCurrentUserThunk } from './thunks/authThunks'
import './index.css'

store.dispatch(fetchCurrentUserThunk())

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <App store={store}>
    <GlobalStyle />
    <RouterProvider router={router} />
  </App>
)
