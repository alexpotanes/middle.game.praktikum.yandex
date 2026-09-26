import { Helmet } from 'react-helmet'

import { ErrorPageLayout } from '../components/error-layout'
import { usePage } from '../hooks/usePage'

export const BadRequestPage = () => {
  usePage({ initPage: initBadRequestPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>400</title>
        <meta name="description" content="Страница ошибки 400" />
      </Helmet>
      <ErrorPageLayout
        code="400"
        title="Некорректный запрос"
        description="Похоже, в запросе есть ошибка. Вернитесь на главную и попробуйте открыть нужный раздел заново."
      />
    </div>
  )
}

export const initBadRequestPage = () => Promise.resolve()
