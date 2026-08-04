import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const Intro = styled.p`
  margin: 0 0 8px;
  max-width: 42rem;
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.text};
`

export const TipsHeading = styled.h2`
  margin: 28px 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.heading};
`

export const TipsList = styled.ul`
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  max-width: 42rem;
`

export const TipItem = styled.li`
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 12px 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(86, 72, 68, 0.04);
  box-shadow: ${shadows.inset};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`

export const TipTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${colors.gold};
`

export const TipText = styled.span`
  font-size: 14px;
  line-height: 1.45;
  color: ${colors.text};
`
