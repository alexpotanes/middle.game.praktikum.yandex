import { decodeTopicDetailsResponse, decodeTopicsResponse } from './forumDecode'
import type { ForumCommentNode, ForumTopic } from './types'

const topic: ForumTopic = {
  id: 1,
  title: 'Tom &amp; Jerry',
  message: '1 &lt; 2 &amp;&amp; 3 &gt; 2',
  authorId: 1,
  authorLogin: 'stepa',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const comment = (
  id: number,
  message: string,
  replies: ForumCommentNode[] = []
) =>
  ({
    id,
    topicId: 1,
    parentId: null,
    authorId: 1,
    authorLogin: 'stepa',
    message,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    replies,
  }) as ForumCommentNode

describe('forumDecode', () => {
  it('декодирует список топиков', () => {
    const result = decodeTopicsResponse({
      topics: [topic],
      total: 1,
      limit: 100,
      offset: 0,
    })

    expect(result.topics[0].title).toBe('Tom & Jerry')
    expect(result.topics[0].message).toBe('1 < 2 && 3 > 2')
    expect(result.total).toBe(1)
  })

  it('рекурсивно декодирует дерево комментариев', () => {
    const result = decodeTopicDetailsResponse({
      topic,
      comments: [comment(1, 'a &amp; b', [comment(2, '&lt;b&gt;')])],
    })

    expect(result.topic.title).toBe('Tom & Jerry')
    expect(result.comments[0].message).toBe('a & b')
    expect(result.comments[0].replies[0].message).toBe('<b>')
  })
})
