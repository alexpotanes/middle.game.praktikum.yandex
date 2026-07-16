import { initMainPage, MainPage } from '../pages/Main'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initLoginPage, LoginPage } from '../pages/LoginPage'
import {
  initRegistrationPage,
  RegistrationPage,
} from '../pages/RegistrationPage'
import { initProfilePage, ProfilePage } from '../pages/ProfilePage'
import { initGamePage, GamePage } from '../pages/GamePage'
import { initLeaderboardPage, LeaderboardPage } from '../pages/LeaderboardPage'
import { initForumPage, ForumPage } from '../pages/ForumPage'
import { ForumTopicPage, initForumTopicPage } from '../pages/ForumTopicPage'
import type { AppRoute } from './types'

export const routes: AppRoute[] = [
  {
    path: '/',
    element: <MainPage />,
    fetchData: initMainPage,
  },
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
  {
    path: '*',
    element: <NotFoundPage />,
    fetchData: initNotFoundPage,
  },
]
