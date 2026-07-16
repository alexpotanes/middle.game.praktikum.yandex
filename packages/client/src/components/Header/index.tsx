import { NavLink } from 'react-router-dom'

import { navigationRoutes } from './constants'

export const Header = () => {
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
