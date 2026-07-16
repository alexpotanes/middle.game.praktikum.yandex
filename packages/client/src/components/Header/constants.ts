type NavigationRoute = {
  path: string
  navTitle: string
}

export const navigationRoutes: NavigationRoute[] = [
  {
    path: '/',
    navTitle: 'Главная',
  },
  {
    path: '/login',
    navTitle: 'Логин',
  },
  {
    path: '/registration',
    navTitle: 'Регистрация',
  },
  {
    path: '/profile',
    navTitle: 'Профиль',
  },
  {
    path: '/game',
    navTitle: 'Игры',
  },
  {
    path: '/leaderboard',
    navTitle: 'Лидерборд',
  },
  {
    path: '/forum',
    navTitle: 'Форум',
  },
  {
    path: '/forum/example-topic',
    navTitle: 'Топик форума',
  },
]
