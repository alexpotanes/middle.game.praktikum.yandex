import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { ForumTopicList } from '../components/forum-topic-list'
import { usePage } from '../hooks/usePage'
import { getForumTopics } from '../mock/forum'
import { CreateLink, Header } from './ForumPage.styles'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  const topics = getForumTopics()

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <Header>
        <h1>Форум</h1>
        <CreateLink to="/forum/new">+ Новый топик</CreateLink>
      </Header>
      <ForumTopicList topics={topics} />
    </Layout>
  )
}

export const initForumPage = () => Promise.resolve()
