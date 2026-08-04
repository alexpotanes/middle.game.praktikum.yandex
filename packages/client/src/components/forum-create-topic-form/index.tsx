import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../button'
import { Form } from '../form'
import formFieldStyles from '../form-field/index.module.css'
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
      <div className={formFieldStyles.field}>
        <label className={formFieldStyles.label} htmlFor="title">
          Заголовок
        </label>
        <input
          id="title"
          name="title"
          className={`${formFieldStyles.input}${
            errors.title ? ` ${formFieldStyles.inputError}` : ''
          }`}
          value={values.title}
          onChange={handleChange}
          placeholder="О чём хотите поговорить?"
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <span className={formFieldStyles.error} role="alert">
            {errors.title}
          </span>
        )}
      </div>
      <div className={`${formFieldStyles.field} ${formFieldStyles.fieldWide}`}>
        <label className={formFieldStyles.label} htmlFor="message">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={`${formFieldStyles.input}${
            errors.message ? ` ${formFieldStyles.inputError}` : ''
          }`}
          value={values.message}
          onChange={handleChange}
          placeholder="Опишите тему подробнее"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <span className={formFieldStyles.error} role="alert">
            {errors.message}
          </span>
        )}
      </div>
    </Form>
  )
}
