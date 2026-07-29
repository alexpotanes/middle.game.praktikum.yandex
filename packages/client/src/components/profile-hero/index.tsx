import { AvatarForm } from '../avatar-form'
import { Button } from '../button'
import styles from './index.module.css'

type ProfileHeroProps = {
  avatar: string | null
  displayName: string | null
  isLoading: boolean
  isLogoutSubmitting: boolean
  login: string | null
  fullName: string | null
  onLogout: () => void
}

export const ProfileHero = ({
  avatar,
  displayName,
  isLoading,
  isLogoutSubmitting,
  login,
  fullName,
  onLogout,
}: ProfileHeroProps) => {
  const subtitle = isLoading ? 'Данные пользователя загружаются' : fullName

  return (
    <section className={styles.hero}>
      <div className={styles.heroInfo}>
        <p className={styles.eyebrow}>Личный кабинет</p>
        <h1 className={styles.title}>{displayName || login || 'Профиль'}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <Button
          className={styles.logoutButton}
          type="button"
          onClick={onLogout}
          disabled={isLogoutSubmitting}>
          {isLogoutSubmitting ? 'Выходим...' : 'Выйти'}
        </Button>
      </div>
      <div className={styles.heroAside}>
        <AvatarForm avatar={avatar} />
      </div>
    </section>
  )
}
