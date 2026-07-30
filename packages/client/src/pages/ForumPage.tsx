import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <h1>Форум</h1>
      <p>Форум в разработке</p>
    </Layout>
  )
}

export const initForumPage = () => Promise.resolve()
