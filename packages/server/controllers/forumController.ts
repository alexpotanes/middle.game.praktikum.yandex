import type { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { Comment, Reaction, Topic } from '../models'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { validatePaginationParams } from '../utils/validators'
import {
  parseId,
  validateCommentInput,
  validateReactionInput,
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

type ForumCommentReaction = {
  emoji: string
  count: number
  reacted: boolean
}

type CommentTreeNode = {
  id: number
  replies?: CommentTreeNode[]
  reactions?: ForumCommentReaction[]
  [key: string]: unknown
}

const buildReactionsSummary = (
  reactions: Reaction[],
  userId: number
): ForumCommentReaction[] => {
  const grouped = new Map<string, ForumCommentReaction>()

  for (const reaction of reactions) {
    const current = grouped.get(reaction.emoji) ?? {
      emoji: reaction.emoji,
      count: 0,
      reacted: false,
    }
    current.count += 1
    if (reaction.userId === userId) current.reacted = true
    grouped.set(reaction.emoji, current)
  }

  return Array.from(grouped.values())
}

const loadCommentOrThrow = async (commentId: number): Promise<Comment> => {
  const comment = await Comment.findByPk(commentId)
  if (!comment) {
    throw new NotFoundError('Комментарий не найден')
  }
  return comment
}

const attachReactionsToTree = (
  nodes: CommentTreeNode[],
  userId: number,
  reactionsByComment: Map<number, Reaction[]>
): CommentTreeNode[] =>
  nodes.map(node => ({
    ...node,
    reactions: buildReactionsSummary(
      reactionsByComment.get(node.id) ?? [],
      userId
    ),
    replies: attachReactionsToTree(
      node.replies ?? [],
      userId,
      reactionsByComment
    ),
  }))

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
  const user = requireUser(req)
  const topicId = parseId(req.params.topicId, 'topicId')

  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new NotFoundError('Топик не найден')
  }

  const comments = await Comment.findAll({
    where: { topicId },
    order: [['createdAt', 'ASC']],
  })

  const commentIds = comments.map(comment => comment.id)
  const reactions = commentIds.length
    ? await Reaction.findAll({ where: { commentId: commentIds } })
    : []

  const reactionsByComment = new Map<number, Reaction[]>()
  for (const reaction of reactions) {
    const list = reactionsByComment.get(reaction.commentId) ?? []
    list.push(reaction)
    reactionsByComment.set(reaction.commentId, list)
  }

  const tree = buildCommentTree(comments) as unknown as CommentTreeNode[]

  res.json({
    topic,
    comments: attachReactionsToTree(tree, user.id, reactionsByComment),
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

export const getCommentReactions = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req)
    const commentId = parseId(req.params.commentId, 'commentId')
    await loadCommentOrThrow(commentId)

    const reactions = await Reaction.findAll({ where: { commentId } })

    res.json(buildReactionsSummary(reactions, user.id))
  }
)

export const addCommentReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req)
    const commentId = parseId(req.params.commentId, 'commentId')
    const { emoji } = validateReactionInput(req.body)
    await loadCommentOrThrow(commentId)

    const existing = await Reaction.findOne({
      where: { commentId, userId: user.id, emoji },
    })

    if (existing) {
      await existing.destroy()
    } else {
      await Reaction.create({ commentId, userId: user.id, emoji })
    }

    const reactions = await Reaction.findAll({ where: { commentId } })
    const current = buildReactionsSummary(reactions, user.id).find(
      reaction => reaction.emoji === emoji
    ) ?? { emoji, count: 0, reacted: false }

    res.status(existing ? 200 : 201).json(current)
  }
)
