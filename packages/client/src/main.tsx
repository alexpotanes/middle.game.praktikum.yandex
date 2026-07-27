import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { router } from './router'
import { GlobalStyle } from './styles/GlobalStyle'
import { fetchCurrentUserThunk } from './thunks/authThunks'

store.dispatch(fetchCurrentUserThunk())

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <GlobalStyle />
    <RouterProvider router={router} />
  </Provider>
)
