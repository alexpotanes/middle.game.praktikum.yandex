import { ROUTES } from '../../router/constants'

type NavigationRoute = {
  path: string
  navTitle: string
}

export const publicNavigationRoutes: NavigationRoute[] = [
  {
    path: '/',
    navTitle: 'Главная',
  },
  {
    path: '/rules',
    navTitle: 'Как играть',
  },
]

export const guestNavigationRoutes: NavigationRoute[] = [
  {
    path: ROUTES.LOGIN,
    navTitle: 'Логин',
  },
  {
    path: ROUTES.REGISTRATION,
    navTitle: 'Регистрация',
  },
]

export const privateNavigationRoutes: NavigationRoute[] = [
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
