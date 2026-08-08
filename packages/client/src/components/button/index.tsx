import { css, styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const buttonLook = css`
  min-height: 44px;
  padding: 10px 18px;
  border: 1px solid ${colors.header};
  border-radius: 8px;
  background: ${colors.header};
  color: ${colors.onHeader};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background: ${colors.crimson};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.65;
  }
`

export const Button = styled.button`
  ${buttonLook}
`
