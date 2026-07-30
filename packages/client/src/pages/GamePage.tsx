import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игры</title>
        <meta name="description" content="Страница игр" />
      </Helmet>
      <h1>Игры</h1>
      <p>Страница игр в разработке</p>
    </Layout>
  )
}

export const initGamePage = () => Promise.resolve()
