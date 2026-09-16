import { ComponentType, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/Loader'
import { ROUTES } from '../router/constants'

type AuthGateProps = {
  children: ReactElement
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const location = useLocation()
  const { isAuthenticated, sessionChecked } = useAuth()

  if (!sessionChecked) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}

export function withAuth<P extends object>(Component: ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => (
    <AuthGate>
      <Component {...props} />
    </AuthGate>
  )

  const name = Component.displayName || Component.name || 'Component'
  AuthenticatedComponent.displayName = `withAuth(${name})`

  return AuthenticatedComponent
}
