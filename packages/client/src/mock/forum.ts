// Мок-данные форума. Настоящее API появится в 8 спринте.

export type ForumComment = {
  id: string
  author: string
  message: string
  createdAt: string
}

export type ForumTopic = {
  id: string
  title: string
  message: string
  author: string
  createdAt: string
  comments: ForumComment[]
}

let nextId = 1
const generateId = (prefix: string) => `${prefix}-${nextId++}`

const topics: ForumTopic[] = [
  {
    id: 'strategy-tips',
    title: 'Советы по стратегии на старте партии',
    message:
      'Делитесь, с чего лучше начинать первые ходы и какие юниты собирать в начале игры.',
    author: 'Стратег',
    createdAt: '2026-07-20T10:00:00.000Z',
    comments: [
      {
        id: generateId('comment'),
        author: 'Полководец',
        message: 'Начинайте с разведки — она открывает карту быстрее всего.',
        createdAt: '2026-07-20T11:15:00.000Z',
      },
      {
        id: generateId('comment'),
        author: 'Ветеран',
        message:
          'Копите золото на апгрейд крепости, это окупается к середине партии.',
        createdAt: '2026-07-20T12:40:00.000Z',
      },
    ],
  },
  {
    id: 'bug-reports',
    title: 'Баги и странности в бою',
    message: 'Тема для отчётов о найденных багах во время сражений.',
    author: 'Тестировщик',
    createdAt: '2026-07-22T09:00:00.000Z',
    comments: [
      {
        id: generateId('comment'),
        author: 'Игрок42',
        message: 'После отмены хода иногда пропадает анимация урона.',
        createdAt: '2026-07-22T09:30:00.000Z',
      },
    ],
  },
]

export const getForumTopics = (): ForumTopic[] => topics

export const getForumTopic = (id: string): ForumTopic | undefined =>
  topics.find(topic => topic.id === id)

type CreateTopicInput = {
  title: string
  message: string
  author: string
}

export const createForumTopic = ({
  title,
  message,
  author,
}: CreateTopicInput): ForumTopic => {
  const topic: ForumTopic = {
    id: generateId('topic'),
    title,
    message,
    author,
    createdAt: new Date().toISOString(),
    comments: [],
  }
  topics.unshift(topic)
  return topic
}

type CreateCommentInput = {
  message: string
  author: string
}

export const createForumComment = (
  topicId: string,
  { message, author }: CreateCommentInput
): ForumComment | undefined => {
  const topic = getForumTopic(topicId)
  if (!topic) return undefined

  const comment: ForumComment = {
    id: generateId('comment'),
    author,
    message,
    createdAt: new Date().toISOString(),
  }
  topic.comments.push(comment)
  return comment
}

export const formatForumDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
