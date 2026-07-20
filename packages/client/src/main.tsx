import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { fetchCurrentUserThunk } from './thunks/authThunks'

import { routes } from './routes'

const router = createBrowserRouter(routes)

store.dispatch(fetchCurrentUserThunk())

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
