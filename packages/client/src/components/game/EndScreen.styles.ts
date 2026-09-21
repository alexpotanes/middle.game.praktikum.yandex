import { styled } from 'styled-components'

import { Button } from '../button'
import { colors, shadows } from '../../styles/theme'

export const ResultHero = styled.div<{ $won: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: ${shadows.card};
  padding: 56px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ $won }) =>
    $won
      ? `linear-gradient(160deg, ${colors.header} 0%, #4a3b2f 55%, #241c1a 100%)`
      : `linear-gradient(160deg, #3a2424 0%, #2a1e1e 55%, #1b1414 100%)`};
`

export const ResultGlow = styled.div<{ $won: boolean }>`
  position: absolute;
  top: -40%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.35;
  background: ${({ $won }) =>
    $won
      ? `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)`
      : `radial-gradient(circle, ${colors.crimson} 0%, transparent 70%)`};
`

export const ResultBadge = styled.div<{ $won: boolean }>`
  position: relative;
  width: 72px;
  height: 72px;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${({ $won }) => ($won ? '#1b1b1b' : colors.onHeader)};
  background: ${({ $won }) =>
    $won
      ? `linear-gradient(160deg, ${colors.gold}, ${colors.goldLight})`
      : `rgba(124, 38, 38, 0.35)`};
  border: 1px solid
    ${({ $won }) => ($won ? colors.goldLight : 'rgba(245, 242, 239, 0.35)')};
`

export const ResultTitle = styled.h2`
  position: relative;
  margin: 0 0 8px;
  font-size: clamp(26px, 4vw, 34px);
  color: ${colors.onHeader};
`

export const ResultReason = styled.p`
  position: relative;
  margin: 0;
  max-width: 420px;
  color: ${colors.onHeader};
  opacity: 0.8;
  font-size: 15px;
  line-height: 1.5;
`

export const ResultStats = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 24px 0 0;
  padding: 16px 24px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(245, 242, 239, 0.12);
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

export const StatLabel = styled.span`
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${colors.onHeader};
  opacity: 0.65;
`

export const StatValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.goldLight};
`

export const StatDivider = styled.span`
  width: 1px;
  align-self: stretch;
  background: rgba(245, 242, 239, 0.18);
`

export const RoundLabel = styled.p`
  position: relative;
  margin: 10px 0 0;
  font-size: 12px;
  color: ${colors.onHeader};
  opacity: 0.55;
`

export const ResultActions = styled.div`
  position: relative;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 28px 0 0;
`

export const PrimaryAction = styled(Button)`
  background: ${colors.gold};
  border-color: ${colors.gold};
  color: #1b1b1b;

  &:hover:not(:disabled) {
    background: ${colors.goldLight};
    border-color: ${colors.goldLight};
  }
`

export const SecondaryAction = styled(Button)`
  background: transparent;
  border-color: rgba(245, 242, 239, 0.4);
  color: ${colors.onHeader};

  &:hover:not(:disabled) {
    background: rgba(245, 242, 239, 0.1);
    border-color: ${colors.onHeader};
  }
`
