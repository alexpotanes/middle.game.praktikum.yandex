import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const RulesPage = () => {
  usePage({ initPage: initRulesPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Как играть</title>
        <meta name="description" content="Страница с правилами игры" />
      </Helmet>
      <h1>Как играть</h1>
      <p>Правила игры в разработке</p>
    </Layout>
  )
}

export const initRulesPage = () => Promise.resolve()
