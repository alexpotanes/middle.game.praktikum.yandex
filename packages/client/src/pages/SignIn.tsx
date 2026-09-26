import { Helmet } from 'react-helmet'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useDispatch } from '../store'
import { loginThunk, startYandexOAuthThunk } from '../thunks/authThunks'
import type { FromLocationState } from '../router/types'
import { ROUTES } from '../router/constants'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { YandexIcon } from '../shared/icons'
import {
  Divider,
  ErrorText,
  Eyebrow,
  FieldError,
  FieldWrapper,
  FormCard,
  Hint,
  Input,
  OAuthButton,
  SubmitButton,
  Title,
  Wrapper,
} from './AuthForm.styles'

export const SignIn = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { error, isLoading } = useAuth()

  const { values, errors, isValid, handleChange, handleBlur, handleSubmit } =
    useForm({
      login: '',
      password: '',
    })

  const from =
    (location.state as FromLocationState | null)?.from?.pathname ?? '/'

  const isSubmitDisabled = isLoading || !isValid

  const onSubmit = handleSubmit(async data => {
    const result = await dispatch(loginThunk(data))
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  })

  const onYandexLoginClick = () => {
    dispatch(startYandexOAuthThunk())
  }

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
        <SubmitButton type="submit" disabled={isSubmitDisabled}>
          {isLoading ? 'Входим…' : 'Войти'}
        </SubmitButton>
        <Divider>или</Divider>
        <OAuthButton
          type="button"
          disabled={isLoading}
          onClick={onYandexLoginClick}>
          <YandexIcon />
          Войти через Яндекс
        </OAuthButton>
        <Hint>
          Нет аккаунта? <Link to={ROUTES.REGISTRATION}>Регистрация</Link>
        </Hint>
      </FormCard>
    </Wrapper>
  )
}

export const initSignInPage = async () => undefined
