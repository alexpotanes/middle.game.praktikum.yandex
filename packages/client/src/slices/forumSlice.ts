import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface ForumComment {
  id: string
  author: string
  message: string
  createdAt: string
}

export interface ForumTopic {
  id: string
  title: string
  message: string
  author: string
  createdAt: string
  comments: ForumComment[]
}

export interface ForumState {
  topics: ForumTopic[]
}

const initialState: ForumState = {
  topics: [
    {
      id: '1',
      title: 'Как проходите второй спринт?',
      message:
        'Делитесь впечатлениями от курса, задавайте вопросы, если что-то не получается.',
      author: 'Мария Иванова',
      createdAt: '2026-07-20T10:00:00.000Z',
      comments: [
        {
          id: '1-1',
          author: 'Иван Петров',
          message: 'Пока всё нравится, но верстка форума заняла время :)',
          createdAt: '2026-07-20T12:30:00.000Z',
        },
      ],
    },
    {
      id: '2',
      title: 'Ищу тиммейта для code review',
      message:
        'Кто хочет обмениваться код-ревью раз в неделю? Пишите в комментарии.',
      author: 'Алексей Смирнов',
      createdAt: '2026-07-22T09:15:00.000Z',
      comments: [],
    },
  ],
}

type AddTopicPayload = {
  title: string
  message: string
  author: string
}

type AddCommentPayload = {
  topicId: string
  message: string
  author: string
}

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    addTopic: {
      reducer: (state, action: PayloadAction<ForumTopic>) => {
        state.topics.unshift(action.payload)
      },
      prepare: ({ title, message, author }: AddTopicPayload) => ({
        payload: {
          id: nanoid(),
          title,
          message,
          author,
          createdAt: new Date().toISOString(),
          comments: [],
        },
      }),
    },
    addComment: {
      reducer: (
        state,
        action: PayloadAction<{ topicId: string; comment: ForumComment }>
      ) => {
        const topic = state.topics.find(
          item => item.id === action.payload.topicId
        )
        if (topic) {
          topic.comments.push(action.payload.comment)
        }
      },
      prepare: ({ topicId, message, author }: AddCommentPayload) => ({
        payload: {
          topicId,
          comment: {
            id: nanoid(),
            author,
            message,
            createdAt: new Date().toISOString(),
          },
        },
      }),
    },
  },
})

export const { addTopic, addComment } = forumSlice.actions

export const selectTopics = (state: RootState) => state.forum.topics

export const selectTopicById = (id: string) => (state: RootState) =>
  state.forum.topics.find(topic => topic.id === id)

export default forumSlice.reducer
