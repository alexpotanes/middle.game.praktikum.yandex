import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initFriendsPage, FriendsPage } from './pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { initForumPage, ForumPage } from './pages/Forum/ForumPage'
import {
  initCreateTopicPage,
  CreateTopicPage,
} from './pages/Forum/CreateTopicPage'
import { initTopicPage, TopicPage } from './pages/Forum/TopicPage'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '/forum',
    Component: ForumPage,
    fetchData: initForumPage,
  },
  {
    path: '/forum/create',
    Component: CreateTopicPage,
    fetchData: initCreateTopicPage,
  },
  {
    path: '/forum/:topicId',
    Component: TopicPage,
    fetchData: initTopicPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
