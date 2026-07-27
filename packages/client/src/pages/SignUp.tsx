import { ChangeEvent, FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from '../store'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectSessionChecked,
} from '../slices/authSlice'
import { registerThunk } from '../thunks/authThunks'
import { STATUS } from '../slices/constants'
import { SignUpRequest } from '../api/types'
import { Loader } from '../components/Loader'
import type { FromLocationState } from '../router/RequireAuth'
import { ROUTES } from '../router/constants'
import {
  ErrorText,
  Eyebrow,
  FormCard,
  Hint,
  Input,
  SubmitButton,
  Title,
  Wrapper,
} from './AuthForm.styles'

const initialForm: SignUpRequest = {
  first_name: '',
  second_name: '',
  login: '',
  email: '',
  password: '',
  phone: '',
}

const fields: {
  name: keyof SignUpRequest
  placeholder: string
  type?: string
}[] = [
  { name: 'first_name', placeholder: 'Имя' },
  { name: 'second_name', placeholder: 'Фамилия' },
  { name: 'login', placeholder: 'Логин' },
  { name: 'email', placeholder: 'Email', type: 'email' },
  { name: 'phone', placeholder: 'Телефон' },
  { name: 'password', placeholder: 'Пароль', type: 'password' },
]

export const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const error = useSelector(selectAuthError)
  const status = useSelector(selectAuthStatus)
  const sessionChecked = useSelector(selectSessionChecked)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [form, setForm] = useState<SignUpRequest>(initialForm)

  const from =
    (location.state as FromLocationState | null)?.from?.pathname ?? '/'

  if (!sessionChecked) {
    return <Loader />
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await dispatch(registerThunk(form))
    if (registerThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <Wrapper>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
      <FormCard onSubmit={handleSubmit}>
        <Eyebrow>War Chest Online</Eyebrow>
        <Title>Регистрация</Title>
        {fields.map(field => (
          <Input
            key={field.name}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
          />
        ))}
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton type="submit" disabled={status === STATUS.LOADING}>
          {status === STATUS.LOADING ? 'Регистрируем…' : 'Зарегистрироваться'}
        </SubmitButton>
        <Hint>
          Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Вход</Link>
        </Hint>
      </FormCard>
    </Wrapper>
  )
}

export const initSignUpPage = async () => undefined
