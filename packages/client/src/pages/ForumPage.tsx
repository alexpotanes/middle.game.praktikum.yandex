import { Helmet } from 'react-helmet'

import { Header } from '../components/header'
import { usePage } from '../hooks/usePage'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <Header />
      <main>
        <h1>Форум</h1>
        <p>Форум в разработке</p>
      </main>
    </div>
  )
}

export const initForumPage = () => Promise.resolve()
