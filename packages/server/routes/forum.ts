import { Router } from 'express'
import * as forumController from '../controllers/forumController'
import { requireAuth } from '../middleware/requireAuth'
import {
  forumReadRateLimiter,
  forumWriteRateLimiter,
} from '../middleware/rateLimiter'

export const forumRouter = Router()

forumRouter.get(
  '/topics',
  forumReadRateLimiter,
  requireAuth,
  forumController.listTopics
)
forumRouter.post(
  '/topics',
  forumWriteRateLimiter,
  requireAuth,
  forumController.createTopic
)
forumRouter.get(
  '/topics/:topicId',
  forumReadRateLimiter,
  requireAuth,
  forumController.getTopic
)
forumRouter.post(
  '/topics/:topicId/comments',
  forumWriteRateLimiter,
  requireAuth,
  forumController.createComment
)
forumRouter.get(
  '/comments/:commentId/reactions',
  forumReadRateLimiter,
  requireAuth,
  forumController.getCommentReactions
)
forumRouter.post(
  '/comments/:commentId/reactions',
  forumWriteRateLimiter,
  requireAuth,
  forumController.addCommentReaction
)
forumRouter.post(
  '/comments/:commentId/replies',
  forumWriteRateLimiter,
  requireAuth,
  forumController.createReply
)
