import { decodeHtmlEntities } from '../utils/escape'
import type {
  ForumComment,
  ForumCommentNode,
  ForumTopic,
  ForumTopicDetailsResponse,
  ForumTopicsResponse,
} from './types'

export const decodeTopic = (topic: ForumTopic): ForumTopic => ({
  ...topic,
  title: decodeHtmlEntities(topic.title),
  message: decodeHtmlEntities(topic.message),
  authorLogin: decodeHtmlEntities(topic.authorLogin),
})

export const decodeComment = <T extends ForumComment>(comment: T): T => ({
  ...comment,
  message: decodeHtmlEntities(comment.message),
  authorLogin: decodeHtmlEntities(comment.authorLogin),
})

export const decodeCommentNode = (
  node: ForumCommentNode
): ForumCommentNode => ({
  ...decodeComment(node),
  replies: (node.replies ?? []).map(decodeCommentNode),
})

export const decodeTopicsResponse = (
  data: ForumTopicsResponse
): ForumTopicsResponse => ({
  ...data,
  topics: data.topics.map(decodeTopic),
})

export const decodeTopicDetailsResponse = (
  data: ForumTopicDetailsResponse
): ForumTopicDetailsResponse => ({
  ...data,
  topic: decodeTopic(data.topic),
  comments: data.comments.map(decodeCommentNode),
})
