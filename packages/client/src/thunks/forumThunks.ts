import { createAsyncThunk } from '@reduxjs/toolkit'
import * as forumApi from '../api/forumApi'
import {
  ApiError,
  ForumComment,
  ForumTopic,
  ForumTopicDetailsResponse,
  ForumTopicsResponse,
} from '../api/types'

export const fetchForumTopicsThunk = createAsyncThunk<
  ForumTopicsResponse,
  void,
  { rejectValue: string }
>('forum/fetchTopics', async (_, { rejectWithValue }) => {
  try {
    return await forumApi.getTopics()
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const fetchForumTopicThunk = createAsyncThunk<
  ForumTopicDetailsResponse,
  number,
  { rejectValue: string }
>('forum/fetchTopic', async (topicId, { rejectWithValue }) => {
  try {
    return await forumApi.getTopic(topicId)
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const createForumTopicThunk = createAsyncThunk<
  ForumTopic,
  { title: string; message: string },
  { rejectValue: string }
>('forum/createTopic', async (data, { rejectWithValue }) => {
  try {
    return await forumApi.createTopic(data)
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const createForumCommentThunk = createAsyncThunk<
  ForumComment,
  { topicId: number; message: string },
  { rejectValue: string }
>('forum/createComment', async ({ topicId, message }, { rejectWithValue }) => {
  try {
    return await forumApi.createComment(topicId, { message })
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})
