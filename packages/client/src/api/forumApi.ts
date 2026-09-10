import { request } from './http'
import {
  CreateForumCommentRequest,
  CreateForumTopicRequest,
  ForumComment,
  ForumTopic,
  ForumTopicDetailsResponse,
  ForumTopicsResponse,
} from './types'

const TOPICS_PAGE_SIZE = 100

export const getTopics = () =>
  request<ForumTopicsResponse>(`/forum/topics?limit=${TOPICS_PAGE_SIZE}`)

export const getTopic = (topicId: number) =>
  request<ForumTopicDetailsResponse>(`/forum/topics/${topicId}`)

export const createTopic = (data: CreateForumTopicRequest) =>
  request<ForumTopic>('/forum/topics', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const createComment = (
  topicId: number,
  data: CreateForumCommentRequest
) =>
  request<ForumComment>(`/forum/topics/${topicId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
