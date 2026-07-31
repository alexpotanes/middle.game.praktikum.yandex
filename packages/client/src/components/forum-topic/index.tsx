import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../button'
import { Form } from '../form'
import formFieldStyles from '../form-field/index.module.css'
import {
  createForumComment,
  formatForumDate,
  getForumTopic,
} from '../../mock/forum'
import { selectUserDisplayName, selectUserLogin } from '../../slices/userSlice'
import { useSelector } from '../../store'
import styles from './index.module.css'

type ForumTopicProps = {
  topicId: string
}

export const ForumTopic = ({ topicId }: ForumTopicProps) => {
  const displayName = useSelector(selectUserDisplayName)
  const login = useSelector(selectUserLogin)
  const author = displayName || login || 'Аноним'

  const topic = getForumTopic(topicId)
  const [comments, setComments] = useState(topic?.comments ?? [])
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | undefined>()

  if (!topic) {
    return (
      <div className={styles.notFound}>
        <p>Такого топика не существует.</p>
        <Link className={styles.backLink} to="/forum">
          ← Назад к форуму
        </Link>
      </div>
    )
  }

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      setError('Введите текст комментария')
      return
    }

    const comment = createForumComment(topicId, { message: trimmed, author })
    if (!comment) return

    setComments(prev => [...prev, comment])
    setMessage('')
    setError(undefined)
  }

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to="/forum">
        ← Назад к форуму
      </Link>

      <article className={styles.topic}>
        <h1 className={styles.title}>{topic.title}</h1>
        <div className={styles.meta}>
          <span>{topic.author}</span>
          <span>{formatForumDate(topic.createdAt)}</span>
        </div>
        <p className={styles.message}>{topic.message}</p>
      </article>

      <section className={styles.comments}>
        <h2 className={styles.commentsTitle}>
          Комментарии ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className={styles.empty}>Комментариев пока нет. Будьте первым!</p>
        ) : (
          <ul className={styles.commentList}>
            {comments.map(comment => (
              <li key={comment.id} className={styles.comment}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentDate}>
                    {formatForumDate(comment.createdAt)}
                  </span>
                </div>
                <p className={styles.commentMessage}>{comment.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Form
        title="Добавить комментарий"
        onSubmit={handleSubmit}
        actions={<Button type="submit">Отправить</Button>}>
        <div className={formFieldStyles.field} style={{ gridColumn: '1 / -1' }}>
          <label className={formFieldStyles.label} htmlFor="comment-message">
            Комментарий
          </label>
          <textarea
            id="comment-message"
            rows={4}
            className={`${formFieldStyles.input}${
              error ? ` ${formFieldStyles.inputError}` : ''
            }`}
            value={message}
            onChange={handleMessageChange}
            placeholder="Ваш комментарий"
            aria-invalid={!!error}
          />
          {error && (
            <span className={formFieldStyles.error} role="alert">
              {error}
            </span>
          )}
        </div>
      </Form>
    </div>
  )
}
