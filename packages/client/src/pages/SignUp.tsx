import { Helmet } from 'react-helmet'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useDispatch } from '../store'
import { registerThunk } from '../thunks/authThunks'
import type { FromLocationState } from '../router/types'
import { ROUTES } from '../router/constants'
import { useAuth } from '../hooks/useAuth'
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

type SignUpField =
  'first_name' | 'second_name' | 'login' | 'email' | 'phone' | 'password'

const fields: {
  name: SignUpField
  placeholder: string
  type?: string
  autoComplete?: string
}[] = [
  { name: 'first_name', placeholder: 'Имя', autoComplete: 'given-name' },
  {
    name: 'second_name',
    placeholder: 'Фамилия',
    autoComplete: 'family-name',
  },
  { name: 'login', placeholder: 'Логин', autoComplete: 'username' },
  {
    name: 'email',
    placeholder: 'Email',
    type: 'email',
    autoComplete: 'email',
  },
  { name: 'phone', placeholder: 'Телефон', type: 'tel', autoComplete: 'tel' },
  {
    name: 'password',
    placeholder: 'Пароль',
    type: 'password',
    autoComplete: 'new-password',
  },
]

export const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { error, isLoading } = useAuth()

  const { values, errors, isValid, handleChange, handleBlur, handleSubmit } =
    useForm({
      first_name: '',
      second_name: '',
      login: '',
      email: '',
      password: '',
      phone: '',
    })

  const from =
    (location.state as FromLocationState | null)?.from?.pathname ?? '/'

  const isSubmitDisabled = isLoading || !isValid

  const onSubmit = handleSubmit(async data => {
    const result = await dispatch(registerThunk(data))
    if (registerThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  })

  return (
    <Wrapper>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
      <FormCard onSubmit={onSubmit} noValidate>
        <Eyebrow>War Chest Online</Eyebrow>
        <Title>Регистрация</Title>
        {fields.map(({ name, placeholder, type, autoComplete }) => (
          <FieldWrapper key={name}>
            <Input
              name={name}
              type={type ?? 'text'}
              placeholder={placeholder}
              autoComplete={autoComplete}
              value={values[name]}
              $error={!!errors[name]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors[name] && (
              <FieldError role="alert">{errors[name]}</FieldError>
            )}
          </FieldWrapper>
        ))}
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton type="submit" disabled={isSubmitDisabled}>
          {isLoading ? 'Регистрируем…' : 'Зарегистрироваться'}
        </SubmitButton>
        <Hint>
          Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Вход</Link>
        </Hint>
      </FormCard>
    </Wrapper>
  )
}

export const initSignUpPage = async () => undefined
