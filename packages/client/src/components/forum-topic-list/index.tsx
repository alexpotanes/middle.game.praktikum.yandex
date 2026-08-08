import { formatForumDate, type ForumTopic } from '../../mock/forum'
import { getForumTopicPath } from '../../router/constants'
import {
  Card,
  CardHeader,
  CommentsCount,
  Empty,
  Excerpt,
  List,
  Meta,
  Title,
} from './styles'

type ForumTopicListProps = {
  topics: ForumTopic[]
}

export const ForumTopicList = ({ topics }: ForumTopicListProps) => {
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
              <CommentsCount>💬 {topic.comments.length}</CommentsCount>
            </CardHeader>
            <Excerpt>{topic.message}</Excerpt>
            <Meta>
              <span>{topic.author}</span>
              <span>{formatForumDate(topic.createdAt)}</span>
            </Meta>
          </Card>
        </li>
      ))}
    </List>
  )
}
