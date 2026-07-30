import { type ButtonHTMLAttributes } from 'react'

import styles from './index.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    className={className ? `${styles.button} ${className}` : styles.button}
    {...props}
  />
)
