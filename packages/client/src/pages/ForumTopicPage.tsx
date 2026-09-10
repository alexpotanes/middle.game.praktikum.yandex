import { Helmet } from 'react-helmet'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { ForumTopic } from '../components/forum-topic'
import { usePage } from '../hooks/usePage'
import { useDispatch, useSelector } from '../store'
import { fetchForumTopicThunk } from '../thunks/forumThunks'
import {
  resetCurrentForumTopic,
  selectCurrentForumTopic,
} from '../slices/forumSlice'

export const ForumTopicPage = () => {
  const { topicId = '' } = useParams()
  usePage({ initPage: initForumTopicPage })

  const dispatch = useDispatch()
  const topic = useSelector(selectCurrentForumTopic)
  const parsedTopicId = Number(topicId)
  const isValidTopicId = Number.isInteger(parsedTopicId) && parsedTopicId > 0

  useEffect(() => {
    if (isValidTopicId) {
      dispatch(fetchForumTopicThunk(parsedTopicId))
    }

    return () => {
      dispatch(resetCurrentForumTopic())
    }
  }, [dispatch, parsedTopicId, isValidTopicId])

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{topic ? topic.title : 'Топик форума'}</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <ForumTopic topicId={parsedTopicId} isValidTopicId={isValidTopicId} />
    </Layout>
  )
}

export const initForumTopicPage = () => Promise.resolve()
