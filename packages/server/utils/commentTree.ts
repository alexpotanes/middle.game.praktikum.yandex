import type { Comment } from '../models/Comment'

export type CommentNode = {
  id: number
  topicId: number
  parentId: number | null
  authorId: number
  authorLogin: string
  message: string
  createdAt: Date
  replies: CommentNode[]
}

const toNode = (comment: Comment): CommentNode => ({
  id: comment.id,
  topicId: comment.topicId,
  parentId: comment.parentId,
  authorId: comment.authorId,
  authorLogin: comment.authorLogin,
  message: comment.message,
  createdAt: comment.createdAt,
  replies: [],
})

export const buildCommentTree = (comments: Comment[]): CommentNode[] => {
  const nodesById = new Map<number, CommentNode>()
  comments.forEach(comment => nodesById.set(comment.id, toNode(comment)))

  const roots: CommentNode[] = []

  comments.forEach(comment => {
    const node = nodesById.get(comment.id)
    if (!node) return

    const parent = comment.parentId ? nodesById.get(comment.parentId) : null

    if (parent) {
      parent.replies.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
