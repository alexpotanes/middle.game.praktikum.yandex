import React from 'react'
import ReactDOM from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { Helmet } from 'react-helmet'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils'
import App from './App'
import { ErrorBoundaryFallback } from './components/error-boundary'
import { createAppStore } from './store'
import { routes } from './router/routes'
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import { GlobalStyle } from './styles/GlobalStyle'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = createAppStore()

  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url)
  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  const [
    {
      route: { fetchData },
    },
  ] = foundRoutes

  try {
    await fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
      ctx: createContext(req),
    })
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  const router = createStaticRouter(dataRoutes, context)
  const sheet = new ServerStyleSheet()
  try {
    // renderToString не поддерживает ErrorBoundary, поэтому при ошибке
    // рендера отдаём страницу ошибки — на клиенте её покажет ErrorBoundary
    let html: string
    try {
      html = ReactDOM.renderToString(
        sheet.collectStyles(
          <App store={store}>
            <GlobalStyle />
            <StaticRouterProvider router={router} context={context} />
          </App>
        )
      )
    } catch (e) {
      console.error('Ошибка SSR-рендера', e)
      html = ReactDOM.renderToString(
        sheet.collectStyles(
          <App store={store}>
            <GlobalStyle />
            <ErrorBoundaryFallback />
          </App>
        )
      )
    }
    const styleTags = sheet.getStyleTags()

    const helmet = Helmet.renderStatic()

    return {
      html,
      helmet,
      styleTags,
      initialState: store.getState(),
    }
  } finally {
    sheet.seal()
  }
}
