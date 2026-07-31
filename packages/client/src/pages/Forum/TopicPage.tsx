import { ChangeEvent, FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { useDispatch, useSelector } from '../../store'
import { Header } from '../../components/Header'
import { usePage } from '../../hooks/usePage'
import { selectUser } from '../../slices/userSlice'
import { addComment, selectTopicById } from '../../slices/forumSlice'
import {
  BackLink,
  CommentAuthor,
  CommentItem,
  CommentList,
  Container,
  Form,
  SubmitButton,
  Textarea,
  TopicBody,
  TopicHeader,
  TopicMeta,
} from './styles'

export const TopicPage = () => {
  const { topicId = '' } = useParams()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const topic = useSelector(selectTopicById(topicId))

  const [message, setMessage] = useState('')

  usePage({ initPage: initTopicPage })

  if (!topic) {
    return (
      <div className="App">
        <Header />
        <Container>
          <BackLink to="/forum">← Ко всем темам</BackLink>
          <p>Тема не найдена</p>
        </Container>
      </div>
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    dispatch(
      addComment({
        topicId: topic.id,
        message: message.trim(),
        author: user ? `${user.name} ${user.secondName}` : 'Аноним',
      })
    )
    setMessage('')
  }

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{topic.title}</title>
        <meta name="description" content={topic.title} />
      </Helmet>
      <Header />
      <Container>
        <BackLink to="/forum">← Ко всем темам</BackLink>

        <TopicHeader>
          <h1>{topic.title}</h1>
          <TopicMeta>
            <span>{topic.author}</span>
          </TopicMeta>
        </TopicHeader>
        <TopicBody>{topic.message}</TopicBody>

        <h2>Комментарии ({topic.comments.length})</h2>
        {topic.comments.length === 0 ? (
          <p>Комментариев пока нет. Оставьте первый!</p>
        ) : (
          <CommentList>
            {topic.comments.map(comment => (
              <CommentItem key={comment.id}>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <p>{comment.message}</p>
              </CommentItem>
            ))}
          </CommentList>
        )}

        <Form onSubmit={handleSubmit}>
          <Textarea
            value={message}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(event.target.value)
            }
            rows={3}
            placeholder="Оставьте комментарий"
          />
          <SubmitButton type="submit">Отправить</SubmitButton>
        </Form>
      </Container>
    </div>
  )
}

export const initTopicPage = () => Promise.resolve()
