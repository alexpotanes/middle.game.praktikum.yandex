import { keyframes, styled } from 'styled-components'

import { Button } from '../button'
import { colors, shadows } from '../../styles/theme'

export const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: ${shadows.card};
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(
    160deg,
    ${colors.header} 0%,
    #4a3b2f 55%,
    #241c1a 100%
  );
`

const ping = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0.55;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
`

export const Radar = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RadarRing = styled.span<{ $delay: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${colors.gold};
  animation: ${ping} 2.2s ease-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`

export const RadarCore = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, ${colors.gold}, ${colors.goldLight});
  color: #1b1b1b;
  box-shadow: 0 0 24px rgba(201, 162, 76, 0.5);
`

export const SearchingTitle = styled.h2`
  position: relative;
  margin: 0 0 8px;
  font-size: clamp(22px, 3.4vw, 28px);
  color: ${colors.onHeader};
`

export const SearchingHint = styled.p`
  position: relative;
  margin: 0;
  max-width: 380px;
  color: ${colors.onHeader};
  opacity: 0.75;
  font-size: 14px;
  line-height: 1.5;
`

export const CancelAction = styled(Button)`
  margin-top: 28px;
  background: transparent;
  border-color: rgba(245, 242, 239, 0.4);
  color: ${colors.onHeader};

  &:hover:not(:disabled) {
    background: rgba(245, 242, 239, 0.1);
    border-color: ${colors.onHeader};
  }
`
