import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { useSelector } from '../store'
import { selectAuthStatus, selectIsAuthenticated } from '../slices/authSlice'
import { STATUS } from '../slices/constants'

type Props = {
  children: ReactNode
}

export const RequireAuth = ({ children }: Props) => {
  const status = useSelector(selectAuthStatus)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (status === STATUS.IDLE || status === STATUS.LOADING) {
    return (
      <Loader>
        <Ring />
        <span>Загрузка…</span>
      </Loader>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 100vh;
  font-family: var(--wc-serif);
  font-size: 18px;
  letter-spacing: 2px;
  color: var(--wc-gold);
`

const Ring = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(217, 178, 106, 0.2);
  border-top-color: var(--wc-gold);
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`
