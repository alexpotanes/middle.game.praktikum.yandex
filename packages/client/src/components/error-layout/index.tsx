import { Link } from 'react-router-dom'

import styles from './index.module.css'

type ErrorPageLayoutProps = {
  code: string
  title: string
  description: string
}

export const ErrorPageLayout = ({
  code,
  title,
  description,
}: ErrorPageLayoutProps) => (
  <div className={styles.content}>
    <p className={styles.code}>{code}</p>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
    <Link className={styles.homeLink} to="/">
      На главную
    </Link>
  </div>
)
