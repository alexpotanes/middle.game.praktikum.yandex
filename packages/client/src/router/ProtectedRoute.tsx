import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { hasAuthToken } from '../utils/auth'

type ProtectedRouteProps = {
  children: ReactNode
}

export const PrivateRoute = ({ children }: ProtectedRouteProps) => {
  return hasAuthToken() ? <>{children}</> : <Navigate to="/login" replace />
}

export const GuestRoute = ({ children }: ProtectedRouteProps) => {
  return hasAuthToken() ? <Navigate to="/" replace /> : <>{children}</>
}
