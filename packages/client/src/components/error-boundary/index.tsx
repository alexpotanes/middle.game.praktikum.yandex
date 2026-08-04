import { Component, type ErrorInfo, type ReactNode } from 'react'

import styles from './index.module.css'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export const ErrorBoundaryFallback = () => (
  <div className={styles.content}>
    <p className={styles.code}>500</p>
    <h1 className={styles.title}>Что-то пошло не так</h1>
    <p className={styles.description}>
      Произошла непредвиденная ошибка. Попробуйте обновить страницу.
    </p>
    <a className={styles.homeLink} href="/">
      На главную
    </a>
  </div>
)

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback />
    }

    return this.props.children
  }
}
