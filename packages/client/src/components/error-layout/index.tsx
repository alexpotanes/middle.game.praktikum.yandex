import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import {
  Code,
  Content,
  Description,
  Title,
  homeLinkLook,
} from '../../styles/ErrorScreen'

type ErrorPageLayoutProps = {
  code: string
  title: string
  description: string
}

const HomeLink = styled(Link)`
  ${homeLinkLook}
`

export const ErrorPageLayout = ({
  code,
  title,
  description,
}: ErrorPageLayoutProps) => (
  <Content>
    <Code>{code}</Code>
    <Title>{title}</Title>
    <Description>{description}</Description>
    <HomeLink to="/">На главную</HomeLink>
  </Content>
)
