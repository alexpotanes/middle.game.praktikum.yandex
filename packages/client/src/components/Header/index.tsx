import { useEffect, useState } from 'react'

import { isAuthorized } from '../../utils/auth'
import {
  guestNavigationRoutes,
  privateNavigationRoutes,
  publicNavigationRoutes,
} from './constants'
import {
  Inner,
  Logo,
  LogoBadge,
  Nav,
  NavItem,
  NavList,
  Wrapper,
} from './styles'

export const Header = () => {
  const [hasAuth, setHasAuth] = useState(false)

  useEffect(() => {
    setHasAuth(isAuthorized())
  }, [])

  const navigationRoutes = hasAuth
    ? [...publicNavigationRoutes, ...privateNavigationRoutes]
    : [...publicNavigationRoutes, ...guestNavigationRoutes]

  return (
    <Wrapper>
      <Inner>
        <Logo to="/">
          <LogoBadge>WC</LogoBadge>
          War Chest
        </Logo>
        <Nav>
          <NavList>
            {navigationRoutes.map(({ path, navTitle }) => (
              <li key={path}>
                <NavItem to={path} end={path === '/'}>
                  {navTitle}
                </NavItem>
              </li>
            ))}
          </NavList>
        </Nav>
      </Inner>
    </Wrapper>
  )
}
