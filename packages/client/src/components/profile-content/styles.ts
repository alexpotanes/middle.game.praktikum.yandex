import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const Page = styled.div`
  min-height: 100vh;
  background: ${colors.bg};
  color: ${colors.text};
`

export const Content = styled.div`
  width: min(1080px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 64px;
`

export const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`
