import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { colors, shadows } from '../styles/theme'

export const Page = styled.div`
  min-height: 100vh;
`

export const Hero = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 56px 24px 40px;
`

export const HeroText = styled.div`
  max-width: 720px;
`

export const Eyebrow = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.heading};
`

export const Title = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
  color: ${colors.heading};
`

export const Greeting = styled.p`
  margin: 0 0 16px;
  font-size: 18px;
  color: ${colors.text};
`

export const Description = styled.p`
  margin: 0 0 28px;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.text};
`

export const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

export const PrimaryButton = styled(Link)`
  ${buttonBase}
  background: ${colors.header};
  color: ${colors.onHeader};
  border: 1px solid ${colors.header};
  box-shadow: ${shadows.card};
`

export const SecondaryButton = styled(Link)`
  ${buttonBase}
  background: transparent;
  color: ${colors.heading};
  border: 1px solid ${colors.header};
`

export const Section = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px;
`

export const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`

export const NavCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(86, 72, 68, 0.15);
  color: ${colors.heading};
  text-decoration: none;
  box-shadow: ${shadows.card};
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${colors.header};
    transform: translateY(-3px);
  }
`

export const NavCardIcon = styled.span`
  color: ${colors.heading};
`

export const NavCardTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.heading};
`

export const NavCardDescription = styled.span`
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.text};
`

export const ScreenshotsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const ScreenshotFigure = styled.figure`
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(86, 72, 68, 0.15);
  box-shadow: ${shadows.card};
`

export const ScreenshotImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: center;
`

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`

export const FeatureCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(86, 72, 68, 0.12);
`

export const FeatureTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  color: ${colors.heading};
`

export const FeatureText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: ${colors.text};
`
