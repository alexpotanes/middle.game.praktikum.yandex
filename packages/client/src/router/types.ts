import type { RouteObject } from 'react-router-dom'

import type { AppDispatch, RootState } from '../store'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export type AppRoute = RouteObject & {
  fetchData: (args: PageInitArgs) => Promise<unknown>
}
