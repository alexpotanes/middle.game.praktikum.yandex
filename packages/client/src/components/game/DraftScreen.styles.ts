import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin: 16px 0;
`

export const Card = styled.button<{
  $border: string
  $taken: boolean
  $clickable: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 10px;
  border: 2px solid ${props => props.$border};
  border-radius: 10px;
  background: ${colors.bg};
  box-shadow: ${shadows.inset};
  font: inherit;
  text-align: center;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  opacity: ${props => (props.$taken ? 0.45 : 1)};
  transition: transform 0.1s ease;

  &:hover {
    transform: ${props => (props.$clickable ? 'translateY(-2px)' : 'none')};
  }
`

export const Portrait = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: #f5f2ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
`

export const UnitName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${colors.heading};
`

export const TacticName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #5b4a8a;
`

export const TacticText = styled.span`
  font-size: 11px;
  line-height: 1.35;
  color: ${colors.text};
`

export const TakenBadge = styled.span<{ $mine: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #f5f2ef;
  background: ${props => (props.$mine ? '#7a9b57' : colors.crimson)};
`

export const PicksRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 8px 0 0;
  font-size: 13px;
  color: ${colors.text};
`

export const PickChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 14px;
  background: ${props => props.$color};
  color: #f5f2ef;
  font-size: 13px;
  font-weight: 700;
`
