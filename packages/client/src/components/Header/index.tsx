import { NavLink } from 'react-router-dom'
import { hasAuthToken } from '../../utils/auth'
import {
  authorizedNavigationRoutes,
  unauthorizedNavigationRoutes,
} from './constants'

export const Header = () => {
  const hasAuth = hasAuthToken()

  const navigationRoutes = hasAuth
    ? authorizedNavigationRoutes
    : unauthorizedNavigationRoutes

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
