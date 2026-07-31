import { Link } from 'react-router-dom'

import { formatForumDate, type ForumTopic } from '../../mock/forum'
import styles from './index.module.css'

type ForumTopicListProps = {
  topics: ForumTopic[]
}

export const ForumTopicList = ({ topics }: ForumTopicListProps) => {
  if (!topics.length) {
    return (
      <p className={styles.empty}>
        Пока нет ни одного топика. Будьте первым, кто начнёт обсуждение!
      </p>
    )
  }

  return (
    <ul className={styles.list}>
      {topics.map(topic => (
        <li key={topic.id}>
          <Link className={styles.card} to={`/forum/${topic.id}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{topic.title}</h2>
              <span className={styles.commentsCount}>
                💬 {topic.comments.length}
              </span>
            </div>
            <p className={styles.excerpt}>{topic.message}</p>
            <div className={styles.meta}>
              <span>{topic.author}</span>
              <span>{formatForumDate(topic.createdAt)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
