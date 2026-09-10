import { Helmet } from 'react-helmet'
import { useEffect } from 'react'

import { Layout } from '../components/Layout'
import { ForumTopicList } from '../components/forum-topic-list'
import { ErrorText } from '../components/form-field/styles'
import { usePage } from '../hooks/usePage'
import { useDispatch, useSelector } from '../store'
import {
  selectForumTopics,
  selectForumTopicsError,
  selectForumTopicsStatus,
} from '../slices/forumSlice'
import { fetchForumTopicsThunk } from '../thunks/forumThunks'
import { STATUS } from '../slices/constants'
import { CreateLink, Header } from './ForumPage.styles'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  const dispatch = useDispatch()
  const topics = useSelector(selectForumTopics)
  const status = useSelector(selectForumTopicsStatus)
  const error = useSelector(selectForumTopicsError)

  useEffect(() => {
    dispatch(fetchForumTopicsThunk())
  }, [dispatch])

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <Header>
        <h1>Форум</h1>
        <CreateLink to="/forum/new">+ Новый топик</CreateLink>
      </Header>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <ForumTopicList
        topics={topics}
        isLoading={status === STATUS.LOADING && topics.length === 0}
      />
    </Layout>
  )
}

export const initForumPage = () => Promise.resolve()
