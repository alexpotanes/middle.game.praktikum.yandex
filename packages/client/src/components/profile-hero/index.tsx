import { AvatarForm } from '../avatar-form'
import {
  Eyebrow,
  Hero,
  HeroAside,
  HeroInfo,
  LogoutButton,
  Subtitle,
  Title,
} from './styles'

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
    <Hero>
      <HeroInfo>
        <Eyebrow>Личный кабинет</Eyebrow>
        <Title>{displayName || login || 'Профиль'}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <LogoutButton
          type="button"
          onClick={onLogout}
          disabled={isLogoutSubmitting}>
          {isLogoutSubmitting ? 'Выходим...' : 'Выйти'}
        </LogoutButton>
      </HeroInfo>
      <HeroAside>
        <AvatarForm avatar={avatar} />
      </HeroAside>
    </Hero>
  )
}
