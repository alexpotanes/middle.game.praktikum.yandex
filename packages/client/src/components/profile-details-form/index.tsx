import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import { ProfileRequest, UserResponse } from '../../api/types'
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
  required?: boolean
}

const profileFields: ProfileField[] = [
  { field: 'first_name', label: 'Имя', required: true },
  { field: 'second_name', label: 'Фамилия', required: true },
  { field: 'display_name', label: 'Отображаемое имя' },
  { field: 'login', label: 'Логин', required: true },
  { field: 'email', label: 'Email', type: 'email', required: true },
  { field: 'phone', label: 'Телефон', required: true },
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
  const [form, setForm] = useState<ProfileRequest>(getProfileForm())
  const [notice, setNotice] = useState<FormNotice | null>(null)
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)

  useEffect(() => {
    setForm(getProfileForm(user))
  }, [user])

  const handleChange =
    (field: keyof ProfileRequest) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)
    setIsProfileSubmitting(true)

    try {
      await dispatch(updateProfileThunk(form)).unwrap()
      setNotice({ isSuccess: true, message: 'Профиль обновлён' })
    } catch (error) {
      setNotice({
        isSuccess: false,
        message:
          typeof error === 'string' ? error : 'Не удалось обновить профиль',
      })
    }

    setIsProfileSubmitting(false)
  }

  return (
    <Form
      title="Данные профиля"
      onSubmit={handleSubmit}
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
      {profileFields.map(({ field, label, type, required }) => (
        <FormField
          key={field}
          id={field}
          label={label}
          type={type}
          value={form[field]}
          onChange={handleChange(field)}
          disabled={isProfileSubmitting}
          required={required}
        />
      ))}
    </Form>
  )
}
