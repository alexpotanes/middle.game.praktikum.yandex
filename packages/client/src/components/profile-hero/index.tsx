import { AvatarForm } from '../avatar-form'
import styles from './index.module.css'

type ProfileHeroProps = {
  avatar: string | null
  displayName: string | null
  isLoading: boolean
  login: string | null
  fullName: string | null
}

export const ProfileHero = ({
  avatar,
  displayName,
  isLoading,
  login,
  fullName,
}: ProfileHeroProps) => {
  const subtitle = isLoading ? 'Данные пользователя загружаются' : fullName

  return (
    <section className={styles.hero}>
      <div className={styles.heroInfo}>
        <p className={styles.eyebrow}>Личный кабинет</p>
        <h1 className={styles.title}>{displayName || login || 'Профиль'}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.heroAside}>
        <AvatarForm avatar={avatar} />
      </div>
    </section>
  )
}
