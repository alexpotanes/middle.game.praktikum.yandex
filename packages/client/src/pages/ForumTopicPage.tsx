import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'

export const ForumTopicPage = () => {
  const { topicId } = useParams()

  usePage({ initPage: initForumTopicPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Топик форума</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <Header />
      <main>
        <h1>Топик форума</h1>
        <p>Топик: {topicId}</p>
      </main>
    </div>
  )
}

export const initForumTopicPage = () => Promise.resolve()
