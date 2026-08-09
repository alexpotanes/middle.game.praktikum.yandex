import { styled } from 'styled-components'

import { Button } from '../button'
import { colors } from '../../styles/theme'

export const Hero = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(86, 72, 68, 0.16);

  @media (max-width: 640px) {
    align-items: center;
    gap: 16px;
  }
`

export const HeroInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const HeroAside = styled.div`
  flex: 0 0 auto;
`

export const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: ${colors.header};
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`

export const Title = styled.h1`
  margin: 0 0 10px;
  color: ${colors.header};
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.1;
`

export const Subtitle = styled.p`
  margin: 0;
  color: #6f625e;
  font-size: 16px;
  line-height: 1.5;
`

export const LogoutButton = styled(Button)`
  width: auto;
  margin-top: 18px;
`
