import { Helmet } from 'react-helmet'
import { ErrorPageLayout } from '../components/error-layout'
import { usePage } from '../hooks/usePage'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>
      <ErrorPageLayout
        code="404"
        title="Страница не найдена"
        description="Такой страницы нет или она была перемещена. Можно вернуться на главную и продолжить оттуда."
      />
    </div>
  )
}

export const initNotFoundPage = () => Promise.resolve()
