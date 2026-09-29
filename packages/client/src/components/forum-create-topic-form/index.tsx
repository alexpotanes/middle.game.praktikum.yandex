import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../button'
import { Form } from '../form'
import { ErrorText, Field, Input, Label } from '../form-field/styles'
import { getForumTopicPath } from '../../router/constants'
import { useDispatch, useSelector } from '../../store'
import {
  clearCreateForumTopicError,
  selectCreateForumTopicError,
  selectCreateForumTopicStatus,
} from '../../slices/forumSlice'
import { createForumTopicThunk } from '../../thunks/forumThunks'
import { STATUS } from '../../slices/constants'
import { FORUM_LIMITS, validateForumText } from '../../utils/validation'

type FormValues = {
  title: string
  message: string
}

type FormErrors = Partial<FormValues>

const initialValues: FormValues = { title: '', message: '' }

const validate = (values: FormValues): FormErrors => {
  const nextErrors: FormErrors = {}
  const titleError = validateForumText(values.title, {
    required: 'Укажите заголовок топика',
    max: FORUM_LIMITS.title,
  })
  const messageError = validateForumText(values.message, {
    required: 'Опишите тему обсуждения',
    max: FORUM_LIMITS.topicMessage,
  })
  if (titleError) nextErrors.title = titleError
  if (messageError) nextErrors.message = messageError
  return nextErrors
}

export const ForumCreateTopicForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const status = useSelector(selectCreateForumTopicStatus)
  const apiError = useSelector(selectCreateForumTopicError)

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (apiError) {
      dispatch(clearCreateForumTopicError())
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = await dispatch(
      createForumTopicThunk({
        title: values.title.trim(),
        message: values.message.trim(),
      })
    )

    if (createForumTopicThunk.fulfilled.match(result)) {
      navigate(getForumTopicPath(result.payload.id))
    }
  }

  const isSubmitting = status === STATUS.LOADING

  return (
    <Form
      title="Новый топик"
      onSubmit={handleSubmit}
      notice={apiError && <ErrorText role="alert">{apiError}</ErrorText>}
      actions={
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать топик'}
        </Button>
      }>
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        {errors.message && <ErrorText role="alert">{errors.message}</ErrorText>}
      </Field>
    </Form>
  )
}
