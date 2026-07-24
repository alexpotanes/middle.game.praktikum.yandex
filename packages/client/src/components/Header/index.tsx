import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { colors } from '../../styles/theme'
import { isAuthorized } from '../../utils/auth'
import {
  guestNavigationRoutes,
  privateNavigationRoutes,
  publicNavigationRoutes,
} from './constants'

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

const Wrapper = styled.header`
  background: ${colors.header};
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.4;
`

const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.onHeader};
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.02em;
`

const LogoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${colors.crimson};
  border: 1px solid ${colors.gold};
  color: ${colors.goldLight};
  font-size: 13px;
  font-weight: 700;
`

const Nav = styled.nav``

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`

const NavItem = styled(NavLink)`
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 8px;
  color: rgba(245, 242, 239, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${colors.onHeader};
  }

  &.active {
    background: rgba(255, 255, 255, 0.16);
    color: ${colors.onHeader};
  }
`
