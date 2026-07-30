import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'

export const ForumTopicPage = () => {
  const { topicId } = useParams()

  usePage({ initPage: initForumTopicPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Топик форума</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <h1>Топик форума</h1>
      <p>Топик: {topicId}</p>
    </Layout>
  )
}

export const initForumTopicPage = () => Promise.resolve()
