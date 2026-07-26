import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const LoginPage = () => {
  usePage({ initPage: initLoginPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Логин</title>
        <meta name="description" content="Страница входа пользователя" />
      </Helmet>
      <Header />
      <main>
        <h1>Логин</h1>
        <p>Страница входа в разработке</p>
      </main>
    </div>
  )
}

export const initLoginPage = () => Promise.resolve()
