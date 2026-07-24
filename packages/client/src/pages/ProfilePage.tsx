import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>
      <h1>Профиль</h1>
      <p>Страница профиля в разработке</p>
    </Layout>
  )
}

export const initProfilePage = () => Promise.resolve()
