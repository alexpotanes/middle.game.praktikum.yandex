import {
  authorizedNavigationRoutes,
  unauthorizedNavigationRoutes,
} from './constants'
import { FullscreenButton } from './FullscreenButton'
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
import { useSelector } from '../../store'
import { selectIsAuthenticated } from '../../slices/authSlice'

export const Header = () => {
  const hasAuth = useSelector(selectIsAuthenticated)

  const navigationRoutes = hasAuth
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
        </Actions>
      </Inner>
    </Wrapper>
  )
}
