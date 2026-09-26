import { ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/Loader'
import type { FromLocationState } from '../router/types'

export function withGuest<P extends object>(Component: ComponentType<P>) {
  const GuestComponent = (props: P) => {
    const location = useLocation()
    const { isAuthenticated, sessionChecked } = useAuth()
    const from =
      (location.state as FromLocationState | null)?.from?.pathname ?? '/'

    if (!sessionChecked) {
      return <Loader />
    }

    if (isAuthenticated) {
      return <Navigate to={from} replace />
    }

    return <Component {...props} />
  }

  const name = Component.displayName || Component.name || 'Component'
  GuestComponent.displayName = `withGuest(${name})`

  return GuestComponent
}
