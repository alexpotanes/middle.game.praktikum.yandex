import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Страница лидерборда" />
      </Helmet>
      <h1>Лидерборд</h1>
      <p>Лидерборд в разработке</p>
    </Layout>
  )
}

export const initLeaderboardPage = () => Promise.resolve()
