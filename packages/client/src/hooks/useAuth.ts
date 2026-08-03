import { useSelector } from '../store'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectSessionChecked,
} from '../slices/authSlice'
import { STATUS } from '../slices/constants'

export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const sessionChecked = useSelector(selectSessionChecked)
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)

  return {
    isAuthenticated,
    sessionChecked,
    status,
    error,
    isLoading: status === STATUS.LOADING,
  }
}
