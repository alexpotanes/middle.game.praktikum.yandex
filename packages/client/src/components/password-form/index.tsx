import { ChangeEvent, FormEvent, useState } from 'react'

import { ChangePasswordRequest } from '../../api/types'
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

const initialPasswordForm: ChangePasswordRequest = {
  oldPassword: '',
  newPassword: '',
}

const getErrorMessage = (error: unknown, fallback: string) =>
  typeof error === 'string' ? error : fallback

export const PasswordForm = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState<ChangePasswordRequest>(initialPasswordForm)
  const [notice, setNotice] = useState<FormNotice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange =
    (field: keyof ChangePasswordRequest) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)
    setIsSubmitting(true)

    try {
      await dispatch(changePasswordThunk(form)).unwrap()
      setNotice({ isSuccess: true, message: 'Пароль изменён' })
      setForm(initialPasswordForm)
    } catch (error) {
      setNotice({
        isSuccess: false,
        message: getErrorMessage(error, 'Не удалось изменить пароль'),
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Form
      title="Пароль"
      onSubmit={handleSubmit}
      notice={
        notice && (
          <Notice tone={notice.isSuccess ? 'success' : 'error'}>
            {notice.message}
          </Notice>
        )
      }
      actions={
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Изменить пароль'}
        </Button>
      }>
      <FormField
        id="oldPassword"
        label="Текущий пароль"
        type="password"
        value={form.oldPassword}
        onChange={handleChange('oldPassword')}
        disabled={isSubmitting}
        required
      />
      <FormField
        id="newPassword"
        label="Новый пароль"
        type="password"
        value={form.newPassword}
        onChange={handleChange('newPassword')}
        disabled={isSubmitting}
        required
      />
    </Form>
  )
}
