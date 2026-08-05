import { styled } from 'styled-components'
import { colors } from '../styles/theme'

export const Page = styled.div`
  min-height: 100vh;
  background: ${colors.bg};
`

export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 64px;
`

export const Section = styled.section`
  padding: 48px 0 32px;
`

export const Eyebrow = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.heading};
  opacity: 0.7;
`

export const Title = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
  color: ${colors.heading};
`

export const Description = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.text};
  max-width: 720px;
`
