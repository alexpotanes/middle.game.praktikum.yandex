import { useCallback, useState } from 'react'

import {
  createForumComment,
  getForumTopic,
  type ForumComment,
  type ForumTopic,
} from '../../mock/forum'

type AddCommentInput = {
  message: string
  author: string
}

export const useForumTopic = (topicId: string) => {
  const [topic, setTopic] = useState<ForumTopic | undefined>(() =>
    getForumTopic(topicId)
  )

  const addComment = useCallback(
    (input: AddCommentInput): ForumComment | undefined => {
      const comment = createForumComment(topicId, input)
      if (!comment) return undefined
      setTopic(current => (current ? { ...current } : current))
      return comment
    },
    [topicId]
  )

  return { topic, addComment }
}
