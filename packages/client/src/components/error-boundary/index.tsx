import { Component, type ErrorInfo, type ReactNode } from 'react'
import { styled } from 'styled-components'

import {
  Code,
  Content,
  Description,
  Title,
  homeLinkLook,
} from '../../styles/ErrorScreen'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

const HomeLink = styled.a`
  ${homeLinkLook}
`

export const ErrorBoundaryFallback = () => (
  <Content>
    <Code>500</Code>
    <Title>Что-то пошло не так</Title>
    <Description>
      Произошла непредвиденная ошибка. Попробуйте обновить страницу.
    </Description>
    <HomeLink href="/">На главную</HomeLink>
  </Content>
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
