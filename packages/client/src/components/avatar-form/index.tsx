import { ChangeEvent, FormEvent, useId, useState } from 'react'

import { useDispatch } from '../../store'
import { updateAvatarThunk } from '../../thunks/userThunks'
import { Notice } from '../notice'
import { Avatar, AvatarButton, FormWrap, Overlay, Placeholder } from './styles'

type AvatarFormProps = {
  avatar: string | null
}

type FormNotice = {
  isSuccess: boolean
  message: string
}

export const AvatarForm = ({ avatar }: AvatarFormProps) => {
  const dispatch = useDispatch()
  const inputId = useId()
  const [notice, setNotice] = useState<FormNotice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const placeholder = isSubmitting ? 'Загрузка...' : 'Загрузить аватар'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const nextAvatar = input.files?.[0]

    if (!nextAvatar) {
      return
    }

    setNotice(null)
    setIsSubmitting(true)

    try {
      await dispatch(updateAvatarThunk(nextAvatar)).unwrap()
      setNotice({ isSuccess: true, message: 'Аватар обновлён' })
    } catch (error) {
      setNotice({
        isSuccess: false,
        message:
          typeof error === 'string' ? error : 'Не удалось обновить аватар',
      })
    } finally {
      input.value = ''
      setIsSubmitting(false)
    }
  }

  return (
    <FormWrap onSubmit={handleSubmit}>
      <AvatarButton htmlFor={inputId}>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={isSubmitting}
        />
        {avatar ? (
          <Avatar src={avatar} alt="Аватар пользователя" />
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        {avatar && (
          <Overlay>{isSubmitting ? 'Загрузка...' : 'Обновить'}</Overlay>
        )}
      </AvatarButton>
      {notice && (
        <Notice tone={notice.isSuccess ? 'success' : 'error'}>
          {notice.message}
        </Notice>
      )}
    </FormWrap>
  )
}
