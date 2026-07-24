import type { ReactNode } from 'react'
import { styled } from 'styled-components'

import { Header } from '../Header'
import { colors } from '../../styles/theme'

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <Content>{children}</Content>
  </>
)

const Content = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px;
  color: ${colors.text};

  h1 {
    margin: 0 0 12px;
    color: ${colors.heading};
    font-size: clamp(28px, 4vw, 36px);
  }

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
  }
`
