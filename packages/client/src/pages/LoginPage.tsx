import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const LoginPage = () => {
  usePage({ initPage: initLoginPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Логин</title>
        <meta name="description" content="Страница входа пользователя" />
      </Helmet>
      <h1>Логин</h1>
      <p>Страница входа в разработке</p>
    </Layout>
  )
}

export const initLoginPage = () => Promise.resolve()
