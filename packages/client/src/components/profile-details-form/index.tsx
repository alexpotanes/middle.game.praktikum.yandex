import { useEffect, useState } from 'react'

import { ProfileRequest, UserResponse } from '../../api/types'
import { useForm } from '../../hooks/useForm'
import { useDispatch } from '../../store'
import { updateProfileThunk } from '../../thunks/userThunks'
import { Button } from '../button'
import { Form } from '../form'
import { FormField } from '../form-field'
import { Notice } from '../notice'

type FormNotice = {
  isSuccess: boolean
  message: string
}

type ProfileDetailsFormProps = {
  user: UserResponse | null
}

type ProfileField = {
  field: keyof ProfileRequest
  label: string
  type?: string
}

const profileFields: ProfileField[] = [
  { field: 'first_name', label: 'Имя' },
  { field: 'second_name', label: 'Фамилия' },
  { field: 'display_name', label: 'Отображаемое имя' },
  { field: 'login', label: 'Логин' },
  { field: 'email', label: 'Email', type: 'email' },
  { field: 'phone', label: 'Телефон' },
]

const getProfileForm = (user?: UserResponse | null): ProfileRequest => ({
  first_name: user?.first_name ?? '',
  second_name: user?.second_name ?? '',
  display_name: user?.display_name ?? '',
  login: user?.login ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
})

export const ProfileDetailsForm = ({ user }: ProfileDetailsFormProps) => {
  const dispatch = useDispatch()
  const [notice, setNotice] = useState<FormNotice | null>(null)
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
  } = useForm(getProfileForm())

  useEffect(() => {
    setFormValues(getProfileForm(user))
  }, [user, setFormValues])

  const onSubmit = handleSubmit(async data => {
    setNotice(null)
    setIsProfileSubmitting(true)

    try {
      await dispatch(updateProfileThunk(data)).unwrap()
      setNotice({ isSuccess: true, message: 'Профиль обновлён' })
    } catch (error) {
      setNotice({
        isSuccess: false,
        message:
          typeof error === 'string' ? error : 'Не удалось обновить профиль',
      })
    } finally {
      setIsProfileSubmitting(false)
    }
  })

  return (
    <Form
      title="Данные профиля"
      onSubmit={onSubmit}
      notice={
        notice && (
          <Notice tone={notice.isSuccess ? 'success' : 'error'}>
            {notice.message}
          </Notice>
        )
      }
      actions={
        <Button type="submit" disabled={isProfileSubmitting}>
          {isProfileSubmitting ? 'Сохранение...' : 'Обновить данные'}
        </Button>
      }>
      {profileFields.map(({ field, label, type }) => (
        <FormField
          key={field}
          id={field}
          label={label}
          type={type}
          value={values[field]}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isProfileSubmitting}
          error={errors[field]}
        />
      ))}
    </Form>
  )
}
