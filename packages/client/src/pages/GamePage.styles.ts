import { styled } from 'styled-components'

import { colors, shadows } from '../styles/theme'

export const Stage = styled.div`
  position: relative;
  width: fit-content;
  margin: 24px auto 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${shadows.card};
`

export const CanvasFrame = styled.canvas`
  display: block;
  background: ${colors.header};
`

export const PlayingControls = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`

export const TimerBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(27, 27, 27, 0.55);
  color: ${colors.onHeader};
  font-size: 14px;
  font-weight: 600;
`
