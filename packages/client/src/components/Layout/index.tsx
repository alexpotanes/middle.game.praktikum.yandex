import type { ReactNode } from 'react'

import { Header } from '../header'
import { Content } from './styles'

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <Content>{children}</Content>
  </>
)
