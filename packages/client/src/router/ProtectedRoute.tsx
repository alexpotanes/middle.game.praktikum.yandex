import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { isAuthorized } from '../utils/auth'

type ProtectedRouteProps = {
  children: ReactNode
}

export const PrivateRoute = ({ children }: ProtectedRouteProps) => {
  return isAuthorized() ? <>{children}</> : <Navigate to="/login" replace />
}

export const GuestRoute = ({ children }: ProtectedRouteProps) => {
  return isAuthorized() ? <Navigate to="/" replace /> : <>{children}</>
}
