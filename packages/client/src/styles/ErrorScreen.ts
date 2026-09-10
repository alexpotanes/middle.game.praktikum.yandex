import { css, styled } from 'styled-components'

import { colors } from './theme'

export const Content = styled.div`
  display: flex;
  min-height: 70vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  text-align: center;
`

export const Code = styled.p`
  margin: 0 0 12px;
  color: #383838;
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
`

export const Title = styled.h1`
  margin: 0 0 12px;
  color: ${colors.header};
  font-size: 32px;
  line-height: 1.2;
`

export const Description = styled.p`
  max-width: 520px;
  margin: 0 0 28px;
  color: ${colors.header};
  font-size: 18px;
  line-height: 1.5;
`

export const homeLinkLook = css`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0 20px;
  background: #383838;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
`
