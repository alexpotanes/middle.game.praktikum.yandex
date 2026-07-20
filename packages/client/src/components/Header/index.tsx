import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from '../../store'
import { selectAuthUser } from '../../slices/authSlice'
import { logoutThunk } from '../../thunks/authThunks'

export const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectAuthUser)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate('/signin')
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/friends">Страница со списком друзей</Link>
        </li>
        <li>
          <Link to="/404">404</Link>
        </li>
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
