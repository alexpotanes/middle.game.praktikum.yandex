import { type ReactNode } from 'react'

import styles from './index.module.css'

type NoticeProps = {
  children: ReactNode
  tone: 'success' | 'error'
}

export const Notice = ({ children, tone }: NoticeProps) => (
  <p
    className={`${styles.notice} ${
      tone === 'error' ? styles.error : styles.success
    }`}>
    {children}
  </p>
)
