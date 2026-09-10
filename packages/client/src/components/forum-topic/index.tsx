import { ChangeEvent, FormEvent, useState } from 'react'

import { Button } from '../button'
import { Form } from '../form'
import { ErrorText, Field, Input, Label } from '../form-field/styles'
import { formatForumDate } from '../../utils/forumDate'
import type { ForumCommentNode } from '../../api/types'
import { useDispatch, useSelector } from '../../store'
import {
  selectCreateForumCommentError,
  selectCreateForumCommentStatus,
  selectCurrentForumTopic,
  selectForumComments,
  selectForumTopicError,
  selectForumTopicStatus,
} from '../../slices/forumSlice'
import { createForumCommentThunk } from '../../thunks/forumThunks'
import { STATUS } from '../../slices/constants'
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
  Replies,
  Title,
  Topic,
} from './styles'

type ForumTopicProps = {
  topicId: number
  isValidTopicId: boolean
}

const CommentNode = ({ comment }: { comment: ForumCommentNode }) => (
  <Comment>
    <CommentMeta>
      <CommentAuthor>{comment.authorLogin}</CommentAuthor>
      <span>{formatForumDate(comment.createdAt)}</span>
    </CommentMeta>
    <CommentMessage>{comment.message}</CommentMessage>
    {comment.replies.length > 0 && (
      <Replies>
        {comment.replies.map(reply => (
          <li key={reply.id}>
            <CommentNode comment={reply} />
          </li>
        ))}
      </Replies>
    )}
  </Comment>
)

export const ForumTopic = ({ topicId, isValidTopicId }: ForumTopicProps) => {
  const dispatch = useDispatch()
  const topic = useSelector(selectCurrentForumTopic)
  const comments = useSelector(selectForumComments)
  const topicStatus = useSelector(selectForumTopicStatus)
  const topicError = useSelector(selectForumTopicError)
  const createCommentStatus = useSelector(selectCreateForumCommentStatus)
  const createCommentError = useSelector(selectCreateForumCommentError)

  const [message, setMessage] = useState('')
  const [validationError, setValidationError] = useState<string | undefined>()

  if (!isValidTopicId || (topicStatus === STATUS.FAILED && !topic)) {
    return (
      <NotFound>
        <p>{topicError ?? 'Такого топика не существует.'}</p>
        <BackLink to="/forum">← Назад к форуму</BackLink>
      </NotFound>
    )
  }

  if (!topic) {
    return <Empty>Загрузка топика...</Empty>
  }

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      setValidationError('Введите текст комментария')
      return
    }

    const result = await dispatch(
      createForumCommentThunk({ topicId, message: trimmed })
    )
    if (createForumCommentThunk.fulfilled.match(result)) {
      setMessage('')
      setValidationError(undefined)
    }
  }

  const isSubmitting = createCommentStatus === STATUS.LOADING

  return (
    <Page>
      <BackLink to="/forum">← Назад к форуму</BackLink>

      <Topic>
        <Title>{topic.title}</Title>
        <Meta>
          <span>{topic.authorLogin}</span>
          <span>{formatForumDate(topic.createdAt)}</span>
        </Meta>
        <Message>{topic.message}</Message>
      </Topic>

      <Comments>
        <CommentsTitle>Комментарии ({comments.length})</CommentsTitle>
        {comments.length === 0 ? (
          <Empty>Комментариев пока нет. Будьте первым!</Empty>
        ) : (
          <CommentList>
            {comments.map(comment => (
              <li key={comment.id}>
                <CommentNode comment={comment} />
              </li>
            ))}
          </CommentList>
        )}
      </Comments>

      <Form
        title="Добавить комментарий"
        onSubmit={handleSubmit}
        actions={
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </Button>
        }>
        <Field $wide>
          <Label htmlFor="comment-message">Комментарий</Label>
          <Input
            as="textarea"
            id="comment-message"
            rows={4}
            $error={!!validationError}
            value={message}
            onChange={handleMessageChange}
            placeholder="Ваш комментарий"
            aria-invalid={!!validationError}
            disabled={isSubmitting}
          />
          {validationError && (
            <ErrorText role="alert">{validationError}</ErrorText>
          )}
          {createCommentError && (
            <ErrorText role="alert">{createCommentError}</ErrorText>
          )}
        </Field>
      </Form>
    </Page>
  )
}
