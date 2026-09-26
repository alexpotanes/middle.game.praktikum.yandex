import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const Control = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ErrorText = styled.span`
  max-width: 240px;
  font-size: 12px;
  color: ${colors.onHeader};
`
