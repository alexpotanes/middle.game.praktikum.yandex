import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../button'
import { Form } from '../form'
import { ErrorText, Field, Input, Label } from '../form-field/styles'
import { createForumTopic } from '../../mock/forum'
import { getForumTopicPath } from '../../router/constants'
import { selectForumAuthorName } from '../../slices/userSlice'
import { useSelector } from '../../store'

type FormValues = {
  title: string
  message: string
}

type FormErrors = Partial<FormValues>

const initialValues: FormValues = { title: '', message: '' }

const validate = (values: FormValues): FormErrors => {
  const nextErrors: FormErrors = {}
  if (!values.title.trim()) nextErrors.title = 'Укажите заголовок топика'
  if (!values.message.trim()) nextErrors.message = 'Опишите тему обсуждения'
  return nextErrors
}

export const ForumCreateTopicForm = () => {
  const navigate = useNavigate()
  const author = useSelector(selectForumAuthorName)

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const topic = createForumTopic({
      title: values.title.trim(),
      message: values.message.trim(),
      author,
    })
    navigate(getForumTopicPath(topic.id))
  }

  return (
    <Form
      title="Новый топик"
      onSubmit={handleSubmit}
      actions={<Button type="submit">Создать топик</Button>}>
      <Field>
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          name="title"
          $error={!!errors.title}
          value={values.title}
          onChange={handleChange}
          placeholder="О чём хотите поговорить?"
          aria-invalid={!!errors.title}
        />
        {errors.title && <ErrorText role="alert">{errors.title}</ErrorText>}
      </Field>
      <Field $wide>
        <Label htmlFor="message">Сообщение</Label>
        <Input
          as="textarea"
          id="message"
          name="message"
          rows={6}
          $error={!!errors.message}
          value={values.message}
          onChange={handleChange}
          placeholder="Опишите тему подробнее"
          aria-invalid={!!errors.message}
        />
        {errors.message && <ErrorText role="alert">{errors.message}</ErrorText>}
      </Field>
    </Form>
  )
}
