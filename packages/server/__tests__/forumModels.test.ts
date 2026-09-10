import { Comment, Topic } from '../models'
import { buildCommentTree } from '../utils/commentTree'
import { resetDb } from '../test-utils/testDb'

describe('forum models', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('создаёт топик', async () => {
    const topic = await Topic.create({
      title: 'Первый топик',
      message: 'Текст топика',
      authorId: 1,
      authorLogin: 'stepa',
    })

    expect(topic.id).toBeDefined()
    expect(topic.title).toBe('Первый топик')
  })

  it('не создаёт топик без заголовка', async () => {
    await expect(
      Topic.create({
        title: '',
        message: 'Текст топика',
        authorId: 1,
        authorLogin: 'stepa',
      })
    ).rejects.toThrow()
  })

  it('поддерживает неограниченную вложенность ответов на комментарии', async () => {
    const topic = await Topic.create({
      title: 'Топик',
      message: 'Сообщение',
      authorId: 1,
      authorLogin: 'stepa',
    })

    const root = await Comment.create({
      topicId: topic.id,
      parentId: null,
      message: 'Комментарий верхнего уровня',
      authorId: 1,
      authorLogin: 'stepa',
    })

    const reply1 = await Comment.create({
      topicId: topic.id,
      parentId: root.id,
      message: 'Ответ первого уровня',
      authorId: 2,
      authorLogin: 'vasya',
    })

    const reply2 = await Comment.create({
      topicId: topic.id,
      parentId: reply1.id,
      message: 'Ответ на ответ',
      authorId: 3,
      authorLogin: 'petya',
    })

    const comments = await Comment.findAll({
      where: { topicId: topic.id },
      order: [['createdAt', 'ASC']],
    })

    const tree = buildCommentTree(comments)

    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe(root.id)
    expect(tree[0].replies).toHaveLength(1)
    expect(tree[0].replies[0].id).toBe(reply1.id)
    expect(tree[0].replies[0].replies).toHaveLength(1)
    expect(tree[0].replies[0].replies[0].id).toBe(reply2.id)
  })
})
