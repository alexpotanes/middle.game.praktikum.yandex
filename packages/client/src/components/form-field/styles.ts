import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const Field = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ $wide }) => $wide && `grid-column: 1 / -1;`}
`

export const Label = styled.label`
  color: ${colors.heading};
  font-size: 14px;
  font-weight: 700;
`

export const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid rgba(86, 72, 68, 0.16);
  border-radius: 8px;
  background: ${colors.surface};
  color: ${colors.text};
  font: inherit;

  &:focus {
    outline: 2px solid rgba(201, 162, 76, 0.35);
    border-color: ${colors.gold};
  }

  &:disabled {
    opacity: 0.65;
  }

  ${({ $error }) =>
    $error &&
    `
    border-color: ${colors.crimson};

    &:focus {
      outline: 2px solid rgba(124, 38, 38, 0.2);
      border-color: ${colors.crimson};
    }
  `}
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: ${colors.crimson};
  line-height: 1.3;
`
