import { initMainPage, MainPage } from '../pages/Main'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initProfilePage, ProfilePage } from '../pages/ProfilePage'
import { initGamePage, GamePage } from '../pages/GamePage'
import { RulesPage, initRulesPage } from '../pages/RulesPage'
import { initLeaderboardPage, LeaderboardPage } from '../pages/LeaderboardPage'
import { initForumPage, ForumPage } from '../pages/ForumPage'
import { ForumTopicPage, initForumTopicPage } from '../pages/ForumTopicPage'
import type { AppRoute } from './types'
import { RequireAuth } from './RequireAuth'
import { initLoginPage, LoginPage } from '../pages/LoginPage'
import {
  initRegistrationPage,
  RegistrationPage,
} from '../pages/RegistrationPage'

// Доступны всем пользователям
const publicRoutes: AppRoute[] = [
  {
    path: '/',
    element: <MainPage />,
    fetchData: initMainPage,
  },
  {
    path: '/rules',
    element: <RulesPage />,
    fetchData: initRulesPage,
  },
]

// Доступны только неавторизованным пользователям
const guestRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
    fetchData: initLoginPage,
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
    fetchData: initRegistrationPage,
  },
]

// Доступны только авторизованным пользователям
const privateRoutes: AppRoute[] = [
  {
    path: '/profile',
    element: <ProfilePage />,
    fetchData: initProfilePage,
  },
  {
    path: '/game',
    element: <GamePage />,
    fetchData: initGamePage,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
    fetchData: initLeaderboardPage,
  },
  {
    path: '/forum',
    element: <ForumPage />,
    fetchData: initForumPage,
  },
  {
    path: '/forum/:topicId',
    element: <ForumTopicPage />,
    fetchData: initForumTopicPage,
  },
]

const notFoundRoute: AppRoute = {
  path: '*',
  element: <NotFoundPage />,
  fetchData: initNotFoundPage,
}

const errorRoutes: AppRoute[] = [
  {
    path: '/400',
    element: <BadRequestPage />,
    fetchData: initBadRequestPage,
  },
  {
    path: '/500',
    element: <ServerErrorPage />,
    fetchData: initServerErrorPage,
  },
]

const withGuestRoute = (route: AppRoute): AppRoute => ({
  ...route,
  element: <GuestRoute>{route.element}</GuestRoute>,
})

const withPrivateGuard = (route: AppRoute): AppRoute => ({
  ...route,
  element: <RequireAuth>{route.element as JSX.Element}</RequireAuth>,
})

export const routes: AppRoute[] = [
  ...publicRoutes,
  ...guestRoutes,
  ...privateRoutes.map(withPrivateGuard),
  notFoundRoute,
  notFoundRoute,
]
