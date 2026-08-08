import { ChangeEvent, FormEvent, useState } from 'react'

import { Button } from '../button'
import { Form } from '../form'
import { ErrorText, Field, Input, Label } from '../form-field/styles'
import { formatForumDate } from '../../mock/forum'
import { selectForumAuthorName } from '../../slices/userSlice'
import { useSelector } from '../../store'
import {
  BackLink,
  Comment,
  CommentAuthor,
  CommentList,
  CommentMessage,
  CommentMeta,
  Comments,
  CommentsTitle,
  Empty,
  Message,
  Meta,
  NotFound,
  Page,
  Title,
  Topic,
} from './styles'
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
      <NotFound>
        <p>Такого топика не существует.</p>
        <BackLink to="/forum">← Назад к форуму</BackLink>
      </NotFound>
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
    <Page>
      <BackLink to="/forum">← Назад к форуму</BackLink>

      <Topic>
        <Title>{topic.title}</Title>
        <Meta>
          <span>{topic.author}</span>
          <span>{formatForumDate(topic.createdAt)}</span>
        </Meta>
        <Message>{topic.message}</Message>
      </Topic>

      <Comments>
        <CommentsTitle>Комментарии ({topic.comments.length})</CommentsTitle>
        {topic.comments.length === 0 ? (
          <Empty>Комментариев пока нет. Будьте первым!</Empty>
        ) : (
          <CommentList>
            {topic.comments.map(comment => (
              <Comment key={comment.id}>
                <CommentMeta>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <span>{formatForumDate(comment.createdAt)}</span>
                </CommentMeta>
                <CommentMessage>{comment.message}</CommentMessage>
              </Comment>
            ))}
          </CommentList>
        )}
      </Comments>

      <Form
        title="Добавить комментарий"
        onSubmit={handleSubmit}
        actions={<Button type="submit">Отправить</Button>}>
        <Field $wide>
          <Label htmlFor="comment-message">Комментарий</Label>
          <Input
            as="textarea"
            id="comment-message"
            rows={4}
            $error={!!error}
            value={message}
            onChange={handleMessageChange}
            placeholder="Ваш комментарий"
            aria-invalid={!!error}
          />
          {error && <ErrorText role="alert">{error}</ErrorText>}
        </Field>
      </Form>
    </Page>
  )
}
