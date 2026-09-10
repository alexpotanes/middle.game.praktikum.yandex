import type { ForumTopic } from '../../api/types'
import { formatForumDate } from '../../utils/forumDate'
import { getForumTopicPath } from '../../router/constants'
import { Card, CardHeader, Empty, Excerpt, List, Meta, Title } from './styles'

type ForumTopicListProps = {
  topics: ForumTopic[]
  isLoading?: boolean
}

export const ForumTopicList = ({
  topics,
  isLoading = false,
}: ForumTopicListProps) => {
  if (isLoading) {
    return <Empty>Загрузка топиков...</Empty>
  }

  if (!topics.length) {
    return (
      <Empty>
        Пока нет ни одного топика. Будьте первым, кто начнёт обсуждение!
      </Empty>
    )
  }

  return (
    <List>
      {topics.map(topic => (
        <li key={topic.id}>
          <Card to={getForumTopicPath(topic.id)}>
            <CardHeader>
              <Title>{topic.title}</Title>
            </CardHeader>
            <Excerpt>{topic.message}</Excerpt>
            <Meta>
              <span>{topic.authorLogin}</span>
              <span>{formatForumDate(topic.createdAt)}</span>
            </Meta>
          </Card>
        </li>
      ))}
    </List>
  )
}
