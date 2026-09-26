import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const Line = styled.hr`
  width: min(420px, 80%);
  height: 1px;
  margin: 0 auto;
  border: 0;
  background: linear-gradient(90deg, transparent, ${colors.gold}, transparent);
  opacity: 0.6;
`
