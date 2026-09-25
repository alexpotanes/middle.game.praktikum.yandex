import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { ValidatorKey, validators } from '../utils/validation'

// Partial: у формы только нужные поля (login/password ≠ весь ValidatorKey)
type Fields = Partial<Record<ValidatorKey, string>>

const getFieldError = (key: ValidatorKey, value: string) =>
  validators[key]?.(value)

const collectErrors = <T extends Fields>(
  values: T
): Partial<Record<ValidatorKey, string>> => {
  const newErrors: Partial<Record<ValidatorKey, string>> = {}
  for (const key of Object.keys(values) as ValidatorKey[]) {
    const error = getFieldError(key, values[key] ?? '')
    if (error) newErrors[key] = error
  }
  return newErrors
}

export function useForm<T extends Fields>(initial: T) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Partial<Record<ValidatorKey, string>>>(
    {}
  )
  const [touched, setTouched] = useState<
    Partial<Record<ValidatorKey, boolean>>
  >({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // live-валидация только после blur; на submit validate() проверяет всё
    if (touched[name as ValidatorKey]) {
      const error = getFieldError(name as ValidatorKey, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = getFieldError(name as ValidatorKey, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validate = (): boolean => {
    const newErrors = collectErrors(values)
    setErrors(newErrors)
    setTouched(
      Object.keys(values).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Partial<Record<ValidatorKey, boolean>>
      )
    )
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit =
    (onValid: (values: T) => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (validate()) onValid(values)
    }

  const setFormValues = useCallback((next: T) => {
    setValues(next)
    setErrors({})
    setTouched({})
  }, [])

  const isValid = Object.keys(collectErrors(values)).length === 0

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
  }
}
