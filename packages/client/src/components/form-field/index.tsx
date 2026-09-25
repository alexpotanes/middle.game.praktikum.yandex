import { type InputHTMLAttributes } from 'react'

import { ErrorText, Field, Input, Label } from './styles'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

export const FormField = ({
  id,
  label,
  error,
  className,
  ...inputProps
}: FormFieldProps) => (
  <Field>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={id}
      className={className}
      $error={!!error}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...inputProps}
    />
    {error && (
      <ErrorText id={`${id}-error`} role="alert">
        {error}
      </ErrorText>
    )}
  </Field>
)
