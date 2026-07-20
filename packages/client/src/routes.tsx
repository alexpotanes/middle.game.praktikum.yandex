import { ComponentType } from 'react'
import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initFriendsPage, FriendsPage } from './pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { RequireAuth } from './components/RequireAuth'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

const protect = (Component: ComponentType) => () => (
  <RequireAuth>
    <Component />
  </RequireAuth>
)

export const routes = [
  {
    path: '/',
    Component: protect(MainPage),
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: protect(FriendsPage),
    fetchData: initFriendsPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
