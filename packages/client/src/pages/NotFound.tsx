import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>
      <h1>404</h1>
      <p>Страница не найдена</p>
    </Layout>
  )
}

export const initNotFoundPage = () => Promise.resolve()
