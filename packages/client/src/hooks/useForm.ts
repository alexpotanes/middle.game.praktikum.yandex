import { ChangeEvent, FormEvent, useState } from 'react'
import { ValidatorKey, validators } from '../utils/validation'

type Fields = Partial<Record<ValidatorKey, string>>

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
    if (touched[name as ValidatorKey]) {
      const error = validators[name as ValidatorKey]?.(value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validators[name as ValidatorKey]?.(value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<ValidatorKey, string>> = {}
    for (const key of Object.keys(values) as ValidatorKey[]) {
      const error = validators[key]?.(values[key] ?? '')
      if (error) newErrors[key] = error
    }
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

  return { values, errors, handleChange, handleBlur, handleSubmit }
}
