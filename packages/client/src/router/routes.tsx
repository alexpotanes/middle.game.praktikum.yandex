import { initMainPage, MainPage } from '../pages/Main'
import { initProfilePage, ProfilePage } from '../pages/ProfilePage'
import { initGamePage, GamePage } from '../pages/GamePage'
import { RulesPage, initRulesPage } from '../pages/RulesPage'
import { initLeaderboardPage, LeaderboardPage } from '../pages/LeaderboardPage'
import { initForumPage, ForumPage } from '../pages/ForumPage'
import { ForumTopicPage, initForumTopicPage } from '../pages/ForumTopicPage'
import type { AppRoute } from './types'
import { withAuth } from '../hocs/withAuth'
import { withGuest } from '../hocs/withGuest'
import { SignIn, initSignInPage } from '../pages/SignIn'
import { SignUp, initSignUpPage } from '../pages/SignUp'
import { ROUTES } from './constants'
import { BadRequestPage, initBadRequestPage } from '../pages/BadRequestPage'
import { initServerErrorPage, ServerErrorPage } from '../pages/ServerErrorPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFoundPage'

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

const GuestSignIn = withGuest(SignIn)
const GuestSignUp = withGuest(SignUp)

const AuthProfilePage = withAuth(ProfilePage)
const AuthGamePage = withAuth(GamePage)
const AuthLeaderboardPage = withAuth(LeaderboardPage)
const AuthForumPage = withAuth(ForumPage)
const AuthForumTopicPage = withAuth(ForumTopicPage)

// Доступны только неавторизованным пользователям
const guestRoutes: AppRoute[] = [
  {
    path: ROUTES.LOGIN,
    element: <GuestSignIn />,
    fetchData: initSignInPage,
  },
  {
    path: ROUTES.REGISTRATION,
    element: <GuestSignUp />,
    fetchData: initSignUpPage,
  },
]

// Доступны только авторизованным пользователям (проверка через withAuth HOC + useAuth)
const privateRoutes: AppRoute[] = [
  {
    path: '/profile',
    element: <AuthProfilePage />,
    fetchData: initProfilePage,
  },
  {
    path: '/game',
    element: <AuthGamePage />,
    fetchData: initGamePage,
  },
  {
    path: '/leaderboard',
    element: <AuthLeaderboardPage />,
    fetchData: initLeaderboardPage,
  },
  {
    path: '/forum',
    element: <AuthForumPage />,
    fetchData: initForumPage,
  },
  {
    path: '/forum/:topicId',
    element: <AuthForumTopicPage />,
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

export const routes: AppRoute[] = [
  ...publicRoutes,
  ...guestRoutes,
  ...errorRoutes,
  ...privateRoutes,
  notFoundRoute,
]
