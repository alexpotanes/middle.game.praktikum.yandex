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
import { useSelector } from '../../store'
import { selectIsAuthenticated } from '../../slices/authSlice'

export const Header = () => {
  const hasAuth = useSelector(selectIsAuthenticated)

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
