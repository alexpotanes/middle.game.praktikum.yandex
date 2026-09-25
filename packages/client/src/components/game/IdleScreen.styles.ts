import { styled } from 'styled-components'

import { Button } from '../button'
import { colors, shadows } from '../../styles/theme'

export const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: ${shadows.card};
  min-height: 320px;
  display: flex;
  align-items: flex-end;
`

export const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const HeroScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(27, 27, 27, 0.15) 0%,
    rgba(27, 27, 27, 0.55) 55%,
    rgba(27, 27, 27, 0.88) 100%
  );
`

export const HeroContent = styled.div`
  position: relative;
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Eyebrow = styled.span`
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(201, 162, 76, 0.18);
  border: 1px solid ${colors.gold};
  color: ${colors.goldLight};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  color: ${colors.onHeader};
`

export const HeroTagline = styled.p`
  margin: 0 0 8px;
  max-width: 480px;
  color: ${colors.onHeader};
  opacity: 0.85;
  font-size: 15px;
  line-height: 1.5;
`

export const HeroButton = styled(Button)`
  background: ${colors.gold};
  border-color: ${colors.gold};
  color: #1b1b1b;

  &:hover:not(:disabled) {
    background: ${colors.goldLight};
    border-color: ${colors.goldLight};
  }
`

export const AboutCard = styled.div`
  position: relative;
  margin: 24px 0 0;
  padding: 20px 24px;
  border-radius: 12px;
  background: ${colors.surfaceMuted};
  border: 1px solid rgba(86, 72, 68, 0.12);
  border-left: 3px solid ${colors.gold};
`

export const AboutLabel = styled.span`
  display: block;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${colors.gold};
`

export const AboutText = styled.p`
  margin: 0;
  max-width: 42rem;
  font-size: 15px;
  line-height: 1.6;
  color: ${colors.text};
`

export const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 28px 0 0;
`

export const TipCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: ${colors.surfaceMuted};
  border: 1px solid rgba(86, 72, 68, 0.12);
`

export const TipIcon = styled.div`
  width: 36px;
  height: 36px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${colors.header};
  color: ${colors.goldLight};
`

export const TipTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 15px;
  color: ${colors.heading};
`

export const TipText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.text};
`
