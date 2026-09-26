import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../store'
import { STATUS, Status } from './constants'
import type {
  ForumCommentNode,
  ForumCommentReaction,
  ForumTopic,
} from '../api/types'
import {
  addForumCommentReactionThunk,
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

  reactionPendingCommentId: number | null
  reactionError: { commentId: number; message: string } | null
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

  reactionPendingCommentId: null,
  reactionError: null,
}

const mergeReaction = (
  reactions: ForumCommentReaction[],
  next: ForumCommentReaction
): ForumCommentReaction[] => {
  const index = reactions.findIndex(r => r.emoji === next.emoji)
  if (index === -1) return [...reactions, next]
  return reactions.map((r, i) => (i === index ? next : r))
}

const applyReactionToTree = (
  comments: ForumCommentNode[],
  commentId: number,
  reaction: ForumCommentReaction
): ForumCommentNode[] =>
  comments.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        reactions: mergeReaction(comment.reactions ?? [], reaction),
      }
    }
    if (comment.replies.length === 0) return comment
    return {
      ...comment,
      replies: applyReactionToTree(comment.replies, commentId, reaction),
    }
  })

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
      state.reactionPendingCommentId = null
      state.reactionError = null
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
        state.comments = [
          ...state.comments,
          { ...action.payload, replies: [], reactions: [] },
        ]
      })
      .addCase(createForumCommentThunk.rejected, (state, action) => {
        state.createCommentStatus = STATUS.FAILED
        state.createCommentError =
          action.payload ?? 'Не удалось отправить комментарий'
      })

      .addCase(addForumCommentReactionThunk.pending, (state, action) => {
        state.reactionPendingCommentId = action.meta.arg.commentId
        state.reactionError = null
      })
      .addCase(addForumCommentReactionThunk.fulfilled, (state, action) => {
        state.reactionPendingCommentId = null
        state.comments = applyReactionToTree(
          state.comments,
          action.payload.commentId,
          action.payload.reaction
        )
      })
      .addCase(addForumCommentReactionThunk.rejected, (state, action) => {
        state.reactionPendingCommentId = null
        state.reactionError = {
          commentId: action.meta.arg.commentId,
          message: action.payload ?? 'Не удалось поставить реакцию',
        }
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

export const selectReactionPendingCommentId = (state: RootState) =>
  state.forum.reactionPendingCommentId
export const selectReactionError = (state: RootState) =>
  state.forum.reactionError

export default forumSlice.reducer
