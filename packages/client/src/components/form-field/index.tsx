import { type InputHTMLAttributes } from 'react'

import styles from './index.module.css'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
}

export const FormField = ({ id, label, ...inputProps }: FormFieldProps) => (
  <div className={styles.field}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    <input className={styles.input} id={id} name={id} {...inputProps} />
  </div>
)
