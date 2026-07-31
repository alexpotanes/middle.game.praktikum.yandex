import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { ForumTopicList } from '../components/forum-topic-list'
import buttonStyles from '../components/button/index.module.css'
import { usePage } from '../hooks/usePage'
import { getForumTopics } from '../mock/forum'
import styles from './ForumPage.module.css'

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
      <div className={styles.header}>
        <h1>Форум</h1>
        <Link
          className={`${buttonStyles.button} ${styles.createLink}`}
          to="/forum/new">
          + Новый топик
        </Link>
      </div>
      <ForumTopicList topics={topics} />
    </Layout>
  )
}

export const initForumPage = () => Promise.resolve()
