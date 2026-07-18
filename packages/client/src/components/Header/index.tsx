import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

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
