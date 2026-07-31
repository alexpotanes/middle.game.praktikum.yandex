import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { useDispatch, useSelector } from '../../store'
import { Header } from '../../components/Header'
import { usePage } from '../../hooks/usePage'
import { selectUser } from '../../slices/userSlice'
import { addTopic } from '../../slices/forumSlice'
import {
  BackLink,
  Container,
  ErrorText,
  Field,
  Form,
  Input,
  SubmitButton,
  Textarea,
} from './styles'

export const CreateTopicPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  usePage({ initPage: initCreateTopicPage })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!title.trim() || !message.trim()) {
      setError('Заполните заголовок и текст темы')
      return
    }

    const { payload } = dispatch(
      addTopic({
        title: title.trim(),
        message: message.trim(),
        author: user ? `${user.name} ${user.secondName}` : 'Аноним',
      })
    )

    navigate(`/forum/${payload.id}`)
  }

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Создание темы</title>
        <meta name="description" content="Создание новой темы на форуме" />
      </Helmet>
      <Header />
      <Container>
        <BackLink to="/forum">← Ко всем темам</BackLink>
        <h1>Создание темы</h1>
        <Form onSubmit={handleSubmit}>
          <Field>
            Заголовок
            <Input
              value={title}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setTitle(event.target.value)
              }
              placeholder="О чём хотите поговорить?"
            />
          </Field>
          <Field>
            Сообщение
            <Textarea
              value={message}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(event.target.value)
              }
              rows={6}
              placeholder="Опишите тему подробнее"
            />
          </Field>
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit">Создать тему</SubmitButton>
        </Form>
      </Container>
    </div>
  )
}

export const initCreateTopicPage = () => Promise.resolve()
