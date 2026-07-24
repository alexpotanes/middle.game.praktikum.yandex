import type { ReactNode } from 'react'
import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

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

const Wrapper = styled.div<{ $align: 'left' | 'center' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'center' ? 'center' : 'flex-start')};
  text-align: ${({ $align }) => $align};
  gap: 10px;
  margin-bottom: 32px;
`

const Eyebrow = styled.span`
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.heading};
`

const Title = styled.h2`
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  color: ${colors.heading};
`

const Subtitle = styled.p`
  margin: 0;
  max-width: 560px;
  color: ${colors.text};
  font-size: 16px;
  line-height: 1.5;
`
