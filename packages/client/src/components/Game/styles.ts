import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 27, 27, 0.55);
  border-radius: inherit;
`

export const OverlayCard = styled.div`
  background: ${colors.bg};
  border-radius: 12px;
  padding: 32px;
  box-shadow: ${shadows.card};
  text-align: center;
  max-width: 360px;
`

export const OverlayTitle = styled.h2`
  margin: 0 0 12px;
  color: ${colors.heading};
  font-size: 24px;
`

export const OverlayText = styled.p`
  margin: 0 0 20px;
  color: ${colors.text};
  font-size: 15px;
  line-height: 1.5;
`

export const ScoreDisplay = styled.div`
  margin: 4px 0 28px;
`

export const ScoreLabel = styled.div`
  margin: 0 0 4px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.text};
  opacity: 0.7;
`

export const ScoreValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  color: ${colors.gold};
`

export const OverlayActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`
