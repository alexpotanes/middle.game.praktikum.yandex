import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProfileHero } from '../profile-hero'
import { PasswordForm } from '../password-form'
import { ProfileDetailsForm } from '../profile-details-form'
import { useAuth } from '../../hooks/useAuth'
import {
  selectUser,
  selectUserAvatar,
  selectUserDisplayName,
  selectUserFullName,
  selectUserLogin,
} from '../../slices/userSlice'
import { useDispatch, useSelector } from '../../store'
import { logoutThunk } from '../../thunks/authThunks'
import { Content, FormsGrid, Page } from './styles'

export const ProfileContent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLogoutSubmitting, setIsLogoutSubmitting] = useState(false)
  const user = useSelector(selectUser)
  const avatar = useSelector(selectUserAvatar)
  const displayName = useSelector(selectUserDisplayName)
  const login = useSelector(selectUserLogin)
  const fullName = useSelector(selectUserFullName)
  const { isLoading: isUserLoading } = useAuth()

  const handleLogout = async () => {
    setIsLogoutSubmitting(true)
    await dispatch(logoutThunk())
    navigate('/')
  }

  return (
    <Page>
      <Content>
        <ProfileHero
          avatar={avatar}
          displayName={displayName}
          fullName={fullName}
          isLoading={isUserLoading}
          isLogoutSubmitting={isLogoutSubmitting}
          login={login}
          onLogout={handleLogout}
        />

        <FormsGrid>
          <ProfileDetailsForm user={user} />
          <PasswordForm />
        </FormsGrid>
      </Content>
    </Page>
  )
}
