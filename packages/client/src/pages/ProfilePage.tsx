import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>
      <Header />
      <main>
        <h1>Профиль</h1>
        <p>Страница профиля в разработке</p>
      </main>
    </div>
  )
}

export const initProfilePage = () => Promise.resolve()
