import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const FormWrap = styled.form`
  display: grid;
  justify-items: center;
  gap: 8px;
  min-width: 112px;

  @media (max-width: 640px) {
    min-width: 92px;
  }
`

export const AvatarButton = styled.label`
  position: relative;
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 2px solid ${colors.gold};
  background: ${colors.surface};
  color: ${colors.heading};
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  input:disabled {
    cursor: default;
  }

  @media (max-width: 640px) {
    width: 92px;
    height: 92px;
  }
`

export const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Placeholder = styled.span`
  font-size: 14px;
  font-weight: 700;
  padding: 12px;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`

export const Overlay = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 12px;
  background: rgba(86, 72, 68, 0.76);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${AvatarButton}:hover &,
  ${AvatarButton}:focus-within & {
    opacity: 1;
  }

  @media (max-width: 640px) {
    font-size: 13px;
  }
`
