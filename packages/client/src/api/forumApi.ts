import { request } from './http'
import {
  decodeComment,
  decodeTopic,
  decodeTopicDetailsResponse,
  decodeTopicsResponse,
} from './forumDecode'
import {
  AddForumCommentReactionRequest,
  CreateForumCommentRequest,
  CreateForumTopicRequest,
  ForumComment,
  ForumCommentReaction,
  ForumTopic,
  ForumTopicDetailsResponse,
  ForumTopicsResponse,
} from './types'

const TOPICS_PAGE_SIZE = 100

export const getTopics = async () =>
  decodeTopicsResponse(
    await request<ForumTopicsResponse>(
      `/forum/topics?limit=${TOPICS_PAGE_SIZE}`
    )
  )

export const getTopic = async (topicId: number) =>
  decodeTopicDetailsResponse(
    await request<ForumTopicDetailsResponse>(`/forum/topics/${topicId}`)
  )

export const createTopic = async (data: CreateForumTopicRequest) =>
  decodeTopic(
    await request<ForumTopic>('/forum/topics', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  )

export const createComment = async (
  topicId: number,
  data: CreateForumCommentRequest
) =>
  decodeComment(
    await request<ForumComment>(`/forum/topics/${topicId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  )

export const getCommentReactions = (commentId: number) =>
  request<ForumCommentReaction[]>(`/forum/comments/${commentId}/reactions`)

export const addCommentReaction = (
  commentId: number,
  data: AddForumCommentReactionRequest
) =>
  request<ForumCommentReaction>(`/forum/comments/${commentId}/reactions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
