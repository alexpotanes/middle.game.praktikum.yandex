import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { isAuthorized } from '../../utils/auth'
import {
  guestNavigationRoutes,
  privateNavigationRoutes,
  publicNavigationRoutes,
} from './constants'

export const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectAuthUser)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate('/signin')
  }

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
      {user && (
        <div>
          <span>{user.display_name || user.login}</span>
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      )}
    </nav>
  )
}
