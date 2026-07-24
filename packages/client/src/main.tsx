import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { router } from './router'
import { fetchCurrentUserThunk } from './thunks/authThunks'

store.dispatch(fetchCurrentUserThunk())

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
