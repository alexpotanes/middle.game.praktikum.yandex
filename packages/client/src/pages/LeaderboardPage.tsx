import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Страница таблицы лидеров" />
      </Helmet>
      <Header />
      <main>
        <h1>Лидерборд</h1>
        <p>Таблица лидеров в разработке</p>
      </main>
    </div>
  )
}

export const initLeaderboardPage = () => Promise.resolve()
