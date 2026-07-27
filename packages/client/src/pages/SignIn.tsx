import { FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from '../store'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectSessionChecked,
} from '../slices/authSlice'
import { loginThunk } from '../thunks/authThunks'
import { STATUS } from '../slices/constants'
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

export const SignIn = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const error = useSelector(selectAuthError)
  const status = useSelector(selectAuthStatus)
  const sessionChecked = useSelector(selectSessionChecked)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const from =
    (location.state as FromLocationState | null)?.from?.pathname ?? '/'

  if (!sessionChecked) {
    return <Loader />
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await dispatch(loginThunk({ login, password }))
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <Wrapper>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <FormCard onSubmit={handleSubmit}>
        <Eyebrow>War Chest Online</Eyebrow>
        <Title>Вход</Title>
        <Input
          name="login"
          placeholder="Логин"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />
        <Input
          name="password"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton type="submit" disabled={status === STATUS.LOADING}>
          {status === STATUS.LOADING ? 'Входим…' : 'Войти'}
        </SubmitButton>
        <Hint>
          Нет аккаунта? <Link to={ROUTES.REGISTRATION}>Регистрация</Link>
        </Hint>
      </FormCard>
    </Wrapper>
  )
}

export const initSignInPage = async () => undefined
