import { styled } from 'styled-components'

import { colors, shadows } from '../styles/theme'

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 16px;
`

export const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 380px;
  max-width: 100%;
  padding: 36px 32px 32px;
  border-radius: 12px;
  border: 1px solid rgba(86, 72, 68, 0.15);
  border-top: 3px solid ${colors.gold};
  background: ${colors.surface};
  box-shadow: ${shadows.card};
`

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.gold};
`

export const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 30px;
  line-height: 1.1;
  text-align: center;
  color: ${colors.heading};
`

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Input = styled.input<{ $error?: boolean }>`
  padding: 12px 14px;
  border: 1px solid
    ${({ $error }) => ($error ? colors.crimson : 'rgba(86, 72, 68, 0.25)')};
  border-radius: 8px;
  background: ${colors.surface};
  color: ${colors.text};
  font-family: inherit;
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? colors.crimson : colors.header)};
    box-shadow: 0 0 0 3px
      ${({ $error }) =>
        $error ? 'rgba(124, 38, 38, 0.18)' : 'rgba(201, 162, 76, 0.25)'};
  }
`

export const FieldError = styled.span`
  font-size: 12px;
  color: ${colors.crimson};
  line-height: 1.3;
`

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  padding: 12px 24px;
  border: 1px solid ${colors.header};
  border-radius: 8px;
  background: ${colors.header};
  color: ${colors.onHeader};
  box-shadow: ${shadows.card};
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${colors.crimson};
  font-size: 13px;
  text-align: center;
`

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
  color: ${colors.muted};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(86, 72, 68, 0.15);
  }
`

export const OAuthButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 24px;
  border: 1px solid rgba(86, 72, 68, 0.25);
  border-radius: 8px;
  background: ${colors.surface};
  color: ${colors.text};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${colors.gold};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`

export const Hint = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  text-align: center;
  color: ${colors.muted};

  a {
    color: ${colors.heading};
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`
