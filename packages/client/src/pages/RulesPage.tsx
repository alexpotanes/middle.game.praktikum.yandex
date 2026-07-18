import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const RulesPage = () => {
  usePage({ initPage: initRulesPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Как играть</title>
        <meta name="description" content="Страница с правилами игры" />
      </Helmet>
      <Header />
      <main>
        <h1>Как играть</h1>
        <p>Правила игры в разработке</p>
      </main>
    </div>
  )
}

export const initRulesPage = () => Promise.resolve()
