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
import { useSelector } from '../../store'
import styles from './index.module.css'

export const ProfileContent = () => {
  const user = useSelector(selectUser)
  const avatar = useSelector(selectUserAvatar)
  const displayName = useSelector(selectUserDisplayName)
  const login = useSelector(selectUserLogin)
  const fullName = useSelector(selectUserFullName)
  const authStatus = useSelector(selectAuthStatus)
  const isUserLoading = authStatus === STATUS.LOADING

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <ProfileHero
          avatar={avatar}
          displayName={displayName}
          fullName={fullName}
          isLoading={isUserLoading}
          login={login}
        />

        <div className={styles.formsGrid}>
          <ProfileDetailsForm user={user} />
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}
