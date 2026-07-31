import { type InputHTMLAttributes } from 'react'

import styles from './index.module.css'

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
  <div className={styles.field}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    <input
      className={`${styles.input}${error ? ` ${styles.inputError}` : ''}${
        className ? ` ${className}` : ''
      }`}
      id={id}
      name={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...inputProps}
    />
    {error && (
      <span id={`${id}-error`} className={styles.error} role="alert">
        {error}
      </span>
    )}
  </div>
)
