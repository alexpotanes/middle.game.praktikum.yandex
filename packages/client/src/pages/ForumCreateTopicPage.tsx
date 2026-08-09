import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { ForumCreateTopicForm } from '../components/forum-create-topic-form'
import { usePage } from '../hooks/usePage'
import { BackLink } from './ForumPage.styles'

export const ForumCreateTopicPage = () => {
  usePage({ initPage: initForumCreateTopicPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новый топик</title>
        <meta name="description" content="Создание новой темы форума" />
      </Helmet>
      <BackLink to="/forum">← Назад к форуму</BackLink>
      <ForumCreateTopicForm />
    </Layout>
  )
}

export const initForumCreateTopicPage = () => Promise.resolve()
