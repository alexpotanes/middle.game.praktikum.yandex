import type { ReactNode } from 'react'

import { Eyebrow, Subtitle, Title, Wrapper } from './styles'

type SectionTitleProps = {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
}

export const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionTitleProps) => (
  <Wrapper $align={align}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <Title>{title}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
)
