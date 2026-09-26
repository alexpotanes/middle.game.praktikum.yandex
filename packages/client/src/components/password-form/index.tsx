import { useState } from 'react'

import { useForm } from '../../hooks/useForm'
import { useDispatch } from '../../store'
import { changePasswordThunk } from '../../thunks/userThunks'
import { Button } from '../button'
import { Form } from '../form'
import { FormField } from '../form-field'
import { Notice } from '../notice'

type FormNotice = {
  isSuccess: boolean
  message: string
}

const initialPasswordForm = {
  oldPassword: '',
  newPassword: '',
}

const getErrorMessage = (error: unknown, fallback: string) =>
  typeof error === 'string' ? error : fallback

export const PasswordForm = () => {
  const dispatch = useDispatch()
  const [notice, setNotice] = useState<FormNotice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
  } = useForm(initialPasswordForm)

  const isSubmitDisabled = isSubmitting || !isValid

  const onSubmit = handleSubmit(async data => {
    setNotice(null)
    setIsSubmitting(true)

    try {
      await dispatch(changePasswordThunk(data)).unwrap()
      setNotice({ isSuccess: true, message: 'Пароль изменён' })
      setFormValues(initialPasswordForm)
    } catch (error) {
      setNotice({
        isSuccess: false,
        message: getErrorMessage(error, 'Не удалось изменить пароль'),
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Form
      title="Пароль"
      onSubmit={onSubmit}
      notice={
        notice && (
          <Notice tone={notice.isSuccess ? 'success' : 'error'}>
            {notice.message}
          </Notice>
        )
      }
      actions={
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Сохранение...' : 'Изменить пароль'}
        </Button>
      }>
      <FormField
        id="oldPassword"
        label="Текущий пароль"
        type="password"
        value={values.oldPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isSubmitting}
        error={errors.oldPassword}
        autoComplete="current-password"
      />
      <FormField
        id="newPassword"
        label="Новый пароль"
        type="password"
        value={values.newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isSubmitting}
        error={errors.newPassword}
        autoComplete="new-password"
      />
    </Form>
  )
}
