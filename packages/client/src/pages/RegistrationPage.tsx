import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const RegistrationPage = () => {
  usePage({ initPage: initRegistrationPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации пользователя" />
      </Helmet>
      <Header />
      <main>
        <h1>Регистрация</h1>
        <p>Страница регистрации в разработке</p>
      </main>
    </div>
  )
}

export const initRegistrationPage = () => Promise.resolve()
