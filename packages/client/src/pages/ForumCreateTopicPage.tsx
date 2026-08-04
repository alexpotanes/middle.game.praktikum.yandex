import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { ForumCreateTopicForm } from '../components/forum-create-topic-form'
import { usePage } from '../hooks/usePage'
import styles from './ForumPage.module.css'

export const ForumCreateTopicPage = () => {
  usePage({ initPage: initForumCreateTopicPage })

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новый топик</title>
        <meta name="description" content="Создание новой темы форума" />
      </Helmet>
      <Link className={styles.backLink} to="/forum">
        ← Назад к форуму
      </Link>
      <ForumCreateTopicForm />
    </Layout>
  )
}

export const initForumCreateTopicPage = () => Promise.resolve()
