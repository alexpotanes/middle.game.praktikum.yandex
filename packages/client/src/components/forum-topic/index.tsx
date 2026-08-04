import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../button'
import { Form } from '../form'
import formFieldStyles from '../form-field/index.module.css'
import { formatForumDate } from '../../mock/forum'
import { selectForumAuthorName } from '../../slices/userSlice'
import { useSelector } from '../../store'
import styles from './index.module.css'
import { useForumTopic } from './useForumTopic'

type ForumTopicProps = {
  topicId: string
}

export const ForumTopic = ({ topicId }: ForumTopicProps) => {
  const author = useSelector(selectForumAuthorName)

  const { topic, addComment } = useForumTopic(topicId)
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

    const comment = addComment({ message: trimmed, author })
    if (!comment) return

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
          Комментарии ({topic.comments.length})
        </h2>
        {topic.comments.length === 0 ? (
          <p className={styles.empty}>Комментариев пока нет. Будьте первым!</p>
        ) : (
          <ul className={styles.commentList}>
            {topic.comments.map(comment => (
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
        <div
          className={`${formFieldStyles.field} ${formFieldStyles.fieldWide}`}>
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
