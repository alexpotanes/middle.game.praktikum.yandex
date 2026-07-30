import { Helmet } from 'react-helmet'

import { Header } from '../components/header'
import { ProfileContent } from '../components/profile-content'
import { usePage } from '../hooks/usePage'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль — War Chest Online</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>

      <Header />

      <ProfileContent />
    </div>
  )
}

export const initProfilePage = () => Promise.resolve()
