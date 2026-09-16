import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../store'
import { STATUS, Status } from './constants'
import type { ForumCommentNode, ForumTopic } from '../api/types'
import {
  createForumCommentThunk,
  createForumTopicThunk,
  fetchForumTopicThunk,
  fetchForumTopicsThunk,
} from '../thunks/forumThunks'

export interface ForumState {
  topics: ForumTopic[]
  topicsStatus: Status
  topicsError: string | null

  currentTopic: ForumTopic | null
  comments: ForumCommentNode[]
  topicStatus: Status
  topicError: string | null

  createTopicStatus: Status
  createTopicError: string | null

  createCommentStatus: Status
  createCommentError: string | null
}

const initialState: ForumState = {
  topics: [],
  topicsStatus: STATUS.IDLE,
  topicsError: null,

  currentTopic: null,
  comments: [],
  topicStatus: STATUS.IDLE,
  topicError: null,

  createTopicStatus: STATUS.IDLE,
  createTopicError: null,

  createCommentStatus: STATUS.IDLE,
  createCommentError: null,
}

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    resetCurrentForumTopic(state) {
      state.currentTopic = null
      state.comments = []
      state.topicStatus = STATUS.IDLE
      state.topicError = null
      state.createCommentStatus = STATUS.IDLE
      state.createCommentError = null
    },
    clearCreateForumTopicError(state) {
      state.createTopicError = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchForumTopicsThunk.pending, state => {
        state.topicsStatus = STATUS.LOADING
        state.topicsError = null
      })
      .addCase(fetchForumTopicsThunk.fulfilled, (state, action) => {
        state.topicsStatus = STATUS.SUCCEEDED
        state.topics = action.payload.topics
      })
      .addCase(fetchForumTopicsThunk.rejected, (state, action) => {
        state.topicsStatus = STATUS.FAILED
        state.topicsError = action.payload ?? 'Не удалось загрузить топики'
      })

      .addCase(fetchForumTopicThunk.pending, state => {
        state.topicStatus = STATUS.LOADING
        state.topicError = null
      })
      .addCase(fetchForumTopicThunk.fulfilled, (state, action) => {
        state.topicStatus = STATUS.SUCCEEDED
        state.currentTopic = action.payload.topic
        state.comments = action.payload.comments
      })
      .addCase(fetchForumTopicThunk.rejected, (state, action) => {
        state.topicStatus = STATUS.FAILED
        state.topicError = action.payload ?? 'Не удалось загрузить топик'
      })

      .addCase(createForumTopicThunk.pending, state => {
        state.createTopicStatus = STATUS.LOADING
        state.createTopicError = null
      })
      .addCase(createForumTopicThunk.fulfilled, (state, action) => {
        state.createTopicStatus = STATUS.SUCCEEDED
        // Топик создан - его увидит и следующий заход на /forum, но сразу
        // подставляем в список, чтобы не гонять лишний запрос.
        state.topics = [action.payload, ...state.topics]
      })
      .addCase(createForumTopicThunk.rejected, (state, action) => {
        state.createTopicStatus = STATUS.FAILED
        state.createTopicError = action.payload ?? 'Не удалось создать топик'
      })

      .addCase(createForumCommentThunk.pending, state => {
        state.createCommentStatus = STATUS.LOADING
        state.createCommentError = null
      })
      .addCase(createForumCommentThunk.fulfilled, (state, action) => {
        state.createCommentStatus = STATUS.SUCCEEDED
        // Комментарии с формы всегда верхнего уровня (parentId: null) -
        // сервер отвечает "плоским" Comment без поля replies, поэтому
        // достраиваем его до узла дерева здесь же.
        state.comments = [...state.comments, { ...action.payload, replies: [] }]
      })
      .addCase(createForumCommentThunk.rejected, (state, action) => {
        state.createCommentStatus = STATUS.FAILED
        state.createCommentError =
          action.payload ?? 'Не удалось отправить комментарий'
      })
  },
})

export const { resetCurrentForumTopic, clearCreateForumTopicError } =
  forumSlice.actions

export const selectForumTopics = (state: RootState) => state.forum.topics
export const selectForumTopicsStatus = (state: RootState) =>
  state.forum.topicsStatus
export const selectForumTopicsError = (state: RootState) =>
  state.forum.topicsError

export const selectCurrentForumTopic = (state: RootState) =>
  state.forum.currentTopic
export const selectForumComments = (state: RootState) => state.forum.comments
export const selectForumTopicStatus = (state: RootState) =>
  state.forum.topicStatus
export const selectForumTopicError = (state: RootState) =>
  state.forum.topicError

export const selectCreateForumTopicStatus = (state: RootState) =>
  state.forum.createTopicStatus
export const selectCreateForumTopicError = (state: RootState) =>
  state.forum.createTopicError

export const selectCreateForumCommentStatus = (state: RootState) =>
  state.forum.createCommentStatus
export const selectCreateForumCommentError = (state: RootState) =>
  state.forum.createCommentError

export default forumSlice.reducer
