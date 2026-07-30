import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProfileHero } from '../profile-hero'
import { PasswordForm } from '../password-form'
import { ProfileDetailsForm } from '../profile-details-form'
import { selectAuthStatus } from '../../slices/authSlice'
import { STATUS } from '../../slices/constants'
import {
  selectUser,
  selectUserAvatar,
  selectUserDisplayName,
  selectUserFullName,
  selectUserLogin,
} from '../../slices/userSlice'
import { useDispatch, useSelector } from '../../store'
import { logoutThunk } from '../../thunks/authThunks'
import styles from './index.module.css'

export const ProfileContent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLogoutSubmitting, setIsLogoutSubmitting] = useState(false)
  const user = useSelector(selectUser)
  const avatar = useSelector(selectUserAvatar)
  const displayName = useSelector(selectUserDisplayName)
  const login = useSelector(selectUserLogin)
  const fullName = useSelector(selectUserFullName)
  const authStatus = useSelector(selectAuthStatus)
  const isUserLoading = authStatus === STATUS.LOADING

  const handleLogout = async () => {
    setIsLogoutSubmitting(true)
    await dispatch(logoutThunk())
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <ProfileHero
          avatar={avatar}
          displayName={displayName}
          fullName={fullName}
          isLoading={isUserLoading}
          isLogoutSubmitting={isLogoutSubmitting}
          login={login}
          onLogout={handleLogout}
        />

        <div className={styles.formsGrid}>
          <ProfileDetailsForm user={user} />
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}
