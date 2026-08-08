import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { buttonLook } from '../components/button'
import { colors } from '../styles/theme'

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
  }
`

export const CreateLink = styled(Link)`
  ${buttonLook}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-decoration: none;
`

export const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: ${colors.header};
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
