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
import { useForm } from '../hooks/useForm'
import {
  ErrorText,
  Eyebrow,
  FieldError,
  FieldWrapper,
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

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm({
    login: '',
    password: '',
  })

  const from =
    (location.state as FromLocationState | null)?.from?.pathname ?? '/'

  if (!sessionChecked) {
    return <Loader />
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = handleSubmit(async data => {
    const result = await dispatch(loginThunk(data))
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  })

  return (
    <Wrapper>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <FormCard onSubmit={onSubmit} noValidate>
        <Eyebrow>War Chest Online</Eyebrow>
        <Title>Вход</Title>
        <FieldWrapper>
          <Input
            name="login"
            placeholder="Логин"
            autoComplete="username"
            value={values.login}
            $error={!!errors.login}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.login && <FieldError role="alert">{errors.login}</FieldError>}
        </FieldWrapper>
        <FieldWrapper>
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            value={values.password}
            $error={!!errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && (
            <FieldError role="alert">{errors.password}</FieldError>
          )}
        </FieldWrapper>
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
