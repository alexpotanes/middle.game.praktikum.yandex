import { ReactElement } from 'react'
import { Navigate, useLocation, type Location } from 'react-router-dom'

import { useSelector } from '../store'
import {
  selectIsAuthenticated,
  selectSessionChecked,
} from '../slices/authSlice'
import { Loader } from '../components/Loader'
import { ROUTES } from './constants'

export interface FromLocationState {
  from?: Location
}

export const RequireAuth = ({ children }: { children: ReactElement }) => {
  const location = useLocation()
  const sessionChecked = useSelector(selectSessionChecked)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (!sessionChecked) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}
