import { Helmet } from 'react-helmet'

import { useSelector } from '../../store'
import { Header } from '../../components/Header'
import { usePage } from '../../hooks/usePage'
import { selectTopics } from '../../slices/forumSlice'
import {
  Container,
  CreateLink,
  TopBar,
  TopicItem,
  TopicList,
  TopicMeta,
  TopicTitleLink,
} from './styles'

export const ForumPage = () => {
  const topics = useSelector(selectTopics)

  usePage({ initPage: initForumPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум: список тем для обсуждения" />
      </Helmet>
      <Header />
      <Container>
        <TopBar>
          <h1>Форум</h1>
          <CreateLink to="/forum/create">Создать тему</CreateLink>
        </TopBar>

        {topics.length === 0 ? (
          <p>Тем пока нет. Будьте первым, кто создаст тему!</p>
        ) : (
          <TopicList>
            {topics.map(topic => (
              <TopicItem key={topic.id}>
                <TopicTitleLink to={`/forum/${topic.id}`}>
                  {topic.title}
                </TopicTitleLink>
                <TopicMeta>
                  <span>{topic.author}</span>
                  <span>Комментариев: {topic.comments.length}</span>
                </TopicMeta>
              </TopicItem>
            ))}
          </TopicList>
        )}
      </Container>
    </div>
  )
}

export const initForumPage = () => Promise.resolve()
