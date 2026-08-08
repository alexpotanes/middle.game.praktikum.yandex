import { type ReactNode } from 'react'
import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

type NoticeTone = 'success' | 'error'

const NoticeText = styled.p<{ $tone: NoticeTone }>`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ $tone }) => ($tone === 'error' ? colors.crimson : colors.success)};
`

type NoticeProps = {
  children: ReactNode
  tone: NoticeTone
}

export const Notice = ({ children, tone }: NoticeProps) => (
  <NoticeText $tone={tone}>{children}</NoticeText>
)
