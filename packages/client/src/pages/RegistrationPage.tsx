import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const RegistrationPage = () => {
  usePage({ initPage: initRegistrationPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации пользователя" />
      </Helmet>
      <h1>Регистрация</h1>
      <p>Страница регистрации в разработке</p>
    </Layout>
  )
}

export const initRegistrationPage = () => Promise.resolve()
