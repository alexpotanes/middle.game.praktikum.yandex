import { styled } from 'styled-components'

import { colors, shadows } from '../styles/theme'

export const GameWrapper = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 56px;
`

export const Title = styled.h1`
  margin: 0 0 16px;
  color: ${colors.heading};
`

export const Canvas = styled.canvas`
  display: block;
  border-radius: 12px;
  box-shadow: ${shadows.card}, ${shadows.inset};
  background: ${colors.bg};
`

export const Hint = styled.p`
  margin: 16px 0 0;
  font-size: 14px;
  color: ${colors.text};
  opacity: 0.75;
`

export const Hud = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin: 0 0 12px;
  font-size: 14px;
  color: ${colors.text};
`

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0;
`

export const StatusText = styled.p`
  font-size: 16px;
  color: ${colors.text};
`

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${colors.crimson};
  margin: 8px 0 0;
`
