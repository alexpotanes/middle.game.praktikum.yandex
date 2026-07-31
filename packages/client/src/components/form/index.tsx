import { FormEventHandler, ReactNode } from 'react'

import styles from './index.module.css'

type FormProps = {
  actions: ReactNode
  children: ReactNode
  notice?: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
}

export const Form = ({
  actions,
  children,
  notice,
  onSubmit,
  title,
}: FormProps) => (
  <section className={styles.panel}>
    <h2 className={styles.panelTitle}>{title}</h2>

    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.fields}>{children}</div>
      <div className={styles.footer}>
        {notice && <div className={styles.formNotice}>{notice}</div>}
        <div className={styles.actions}>{actions}</div>
      </div>
    </form>
  </section>
)
