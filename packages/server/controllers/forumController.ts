import type { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { Comment, Topic } from '../models'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { validatePaginationParams } from '../utils/validators'
import {
  parseId,
  validateCommentInput,
  validateTopicInput,
} from '../utils/forumValidation'
import { buildCommentTree } from '../utils/commentTree'
import type { PracticumUser } from '../types/requestUser'

const requireUser = (req: Request): PracticumUser => {
  if (!req.user) {
    throw new UnauthorizedError('Необходима авторизация')
  }
  return req.user
}

export const listTopics = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = validatePaginationParams(req.query)

  const { rows, count } = await Topic.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  })

  res.json({
    topics: rows,
    total: count,
    limit,
    offset,
  })
})

export const getTopic = asyncHandler(async (req: Request, res: Response) => {
  const topicId = parseId(req.params.topicId, 'topicId')

  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new NotFoundError('Топик не найден')
  }

  const comments = await Comment.findAll({
    where: { topicId },
    order: [['createdAt', 'ASC']],
  })

  res.json({
    topic,
    comments: buildCommentTree(comments),
  })
})

export const createTopic = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req)
  const { title, message } = validateTopicInput(req.body)

  const topic = await Topic.create({
    title,
    message,
    authorId: user.id,
    authorLogin: user.login,
  })

  res.status(201).json(topic)
})

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req)
    const topicId = parseId(req.params.topicId, 'topicId')
    const { message } = validateCommentInput(req.body)

    const topic = await Topic.findByPk(topicId)
    if (!topic) {
      throw new NotFoundError('Топик не найден')
    }

    const comment = await Comment.create({
      topicId,
      parentId: null,
      message,
      authorId: user.id,
      authorLogin: user.login,
    })

    res.status(201).json(comment)
  }
)

export const createReply = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req)
  const parentId = parseId(req.params.commentId, 'commentId')
  const { message } = validateCommentInput(req.body)

  const parent = await Comment.findByPk(parentId)
  if (!parent) {
    throw new NotFoundError('Комментарий не найден')
  }

  const reply = await Comment.create({
    topicId: parent.topicId,
    parentId: parent.id,
    message,
    authorId: user.id,
    authorLogin: user.login,
  })

  res.status(201).json(reply)
})
