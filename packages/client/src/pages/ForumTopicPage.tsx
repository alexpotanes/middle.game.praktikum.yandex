import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { ForumTopic } from '../components/forum-topic'
import { getForumTopic } from '../mock/forum'
import { usePage } from '../hooks/usePage'

export const ForumTopicPage = () => {
  const { topicId = '' } = useParams()
  usePage({ initPage: initForumTopicPage })

  const topic = getForumTopic(topicId)

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{topic ? topic.title : 'Топик не найден'}</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <ForumTopic topicId={topicId} />
    </Layout>
  )
}

export const initForumTopicPage = () => Promise.resolve()
