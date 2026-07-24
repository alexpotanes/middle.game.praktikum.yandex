import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игры</title>
        <meta name="description" content="Страница игр" />
      </Helmet>
      <Header />
      <main>
        <h1>Игры</h1>
        <p>Страница игр в разработке</p>
      </main>
    </div>
  )
}

export const initGamePage = () => Promise.resolve()
