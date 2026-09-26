import { Helmet } from 'react-helmet'
import { ErrorPageLayout } from '../components/error-layout'
import { usePage } from '../hooks/usePage'

export const ServerErrorPage = () => {
  usePage({ initPage: initServerErrorPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>500</title>
        <meta name="description" content="Страница ошибки 500" />
      </Helmet>
      <ErrorPageLayout
        code="500"
        title="Ошибка на сервере"
        description="Что-то пошло не так на нашей стороне. Попробуйте обновить страницу чуть позже."
      />
    </div>
  )
}

export const initServerErrorPage = () => Promise.resolve()
