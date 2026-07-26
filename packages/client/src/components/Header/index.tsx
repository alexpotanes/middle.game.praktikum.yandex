import { NavLink } from 'react-router-dom'

import {
  guestNavigationRoutes,
  privateNavigationRoutes,
  publicNavigationRoutes,
} from './constants'
import { useSelector } from '../../store'
import { selectIsAuthenticated } from '../../slices/authSlice'

export const Header = () => {
  const hasAuth = useSelector(selectIsAuthenticated)

  const navigationRoutes = hasAuth
    ? [...publicNavigationRoutes, ...privateNavigationRoutes]
    : [...publicNavigationRoutes, ...guestNavigationRoutes]

  return (
    <nav>
      <ul>
        {navigationRoutes.map(({ path, navTitle }) => (
          <li key={path}>
            <NavLink to={path}>{navTitle}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
