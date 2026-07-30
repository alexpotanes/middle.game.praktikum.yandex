import { ChangeEvent, FormEvent, useId, useState } from 'react'

import { useDispatch } from '../../store'
import { updateAvatarThunk } from '../../thunks/userThunks'
import { Notice } from '../notice'
import styles from './index.module.css'

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.avatarButton} htmlFor={inputId}>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={isSubmitting}
        />
        {avatar ? (
          <img
            className={styles.avatar}
            src={avatar}
            alt="Аватар пользователя"
          />
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        {avatar && (
          <span className={styles.overlay}>
            {isSubmitting ? 'Загрузка...' : 'Обновить'}
          </span>
        )}
      </label>
      {notice && (
        <Notice tone={notice.isSuccess ? 'success' : 'error'}>
          {notice.message}
        </Notice>
      )}
    </form>
  )
}
