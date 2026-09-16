import {
  authorizedNavigationRoutes,
  unauthorizedNavigationRoutes,
} from './constants'
import { FullscreenButton } from './FullscreenButton'
import { ThemeToggle } from './ThemeToggle'
import {
  Actions,
  Inner,
  Logo,
  LogoBadge,
  Nav,
  NavItem,
  NavList,
  Wrapper,
} from './styles'
import { useAuth } from '../../hooks/useAuth'

export const Header = () => {
  const { isAuthenticated } = useAuth()

  const navigationRoutes = isAuthenticated
    ? authorizedNavigationRoutes
    : unauthorizedNavigationRoutes

  return (
    <Wrapper>
      <Inner>
        <Logo to="/">
          <LogoBadge>WC</LogoBadge>
          War Chest
        </Logo>
        <Actions>
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
          <FullscreenButton />
          <ThemeToggle />
        </Actions>
      </Inner>
    </Wrapper>
  )
}
