import express from 'express'
import request from 'supertest'
import { forumRouter } from '../routes/forum'
import { errorHandler } from '../middleware/errorHandler'
import * as authService from '../services/authService'
import { resetDb } from '../test-utils/testDb'

jest.mock('../services/authService')

const mockedGetUser = authService.getUser as jest.MockedFunction<
  typeof authService.getUser
>

const buildApp = () => {
  const app = express()
  app.use(express.json())
  app.use('/forum', forumRouter)
  app.use(errorHandler)
  return app
}

const authorize = (user: { id: number; login: string }) =>
  mockedGetUser.mockResolvedValue({ status: 200, data: user, setCookie: [] })

const unauthorize = () =>
  mockedGetUser.mockResolvedValue({ status: 401, data: null, setCookie: [] })

describe('forum routes', () => {
  const app = buildApp()

  beforeEach(async () => {
    await resetDb()
    jest.clearAllMocks()
  })

  it('отдаёт 403 для неавторизованного пользователя', async () => {
    unauthorize()

    const res = await request(app).get('/forum/topics')

    expect(res.status).toBe(403)
  })

  it('отдаёт 403, если API Практикума вернуло 401', async () => {
    mockedGetUser.mockResolvedValue({ status: 401, data: null, setCookie: [] })

    const res = await request(app).get('/forum/topics')

    expect(res.status).toBe(403)
  })

  it('не подменяет 5xx от API Практикума на 403 (сессия могла быть валидной)', async () => {
    mockedGetUser.mockResolvedValue({
      status: 500,
      data: { error: 'internal' },
      setCookie: [],
    })

    const res = await request(app).get('/forum/topics')

    expect(res.status).toBe(502)
    expect(res.status).not.toBe(403)
  })

  it('пробрасывает 429 от API Практикума как 429, а не как 403', async () => {
    mockedGetUser.mockResolvedValue({ status: 429, data: null, setCookie: [] })

    const res = await request(app).get('/forum/topics')

    expect(res.status).toBe(429)
  })

  it('возвращает 502, если getUser падает с ошибкой сети', async () => {
    mockedGetUser.mockRejectedValue(new Error('network error'))

    const res = await request(app).get('/forum/topics')

    expect(res.status).toBe(502)
  })

  it('позволяет авторизованному пользователю создать топик', async () => {
    authorize({ id: 1, login: 'stepa' })

    const res = await request(app)
      .post('/forum/topics')
      .send({ title: 'Новый топик', message: 'Текст топика' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: 'Новый топик',
      message: 'Текст топика',
      authorId: 1,
      authorLogin: 'stepa',
    })
  })

  it('отклоняет создание топика без заголовка', async () => {
    authorize({ id: 1, login: 'stepa' })

    const res = await request(app)
      .post('/forum/topics')
      .send({ title: '  ', message: 'Текст топика' })

    expect(res.status).toBe(400)
  })

  it('вырезает html из заголовка и текста топика (XSS)', async () => {
    authorize({ id: 1, login: 'stepa' })

    const res = await request(app).post('/forum/topics').send({
      title: '<script>alert(1)</script>Заголовок',
      message: '<img src=x onerror="alert(1)">Текст',
    })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Заголовок')
    expect(res.body.message).toBe('Текст')
    expect(res.body.title).not.toContain('<script>')
    expect(res.body.message).not.toContain('onerror')
  })

  it('строит дерево комментариев и ответов для топика', async () => {
    authorize({ id: 1, login: 'stepa' })

    const topicRes = await request(app)
      .post('/forum/topics')
      .send({ title: 'Топик', message: 'Сообщение' })
    const topicId = topicRes.body.id

    const commentRes = await request(app)
      .post(`/forum/topics/${topicId}/comments`)
      .send({ message: 'Комментарий верхнего уровня' })
    const commentId = commentRes.body.id

    authorize({ id: 2, login: 'vasya' })
    await request(app)
      .post(`/forum/comments/${commentId}/replies`)
      .send({ message: 'Ответ на комментарий' })

    const res = await request(app).get(`/forum/topics/${topicId}`)

    expect(res.status).toBe(200)
    expect(res.body.comments).toHaveLength(1)
    expect(res.body.comments[0].replies).toHaveLength(1)
    expect(res.body.comments[0].replies[0].message).toBe('Ответ на комментарий')
  })

  it('возвращает 404 для несуществующего топика', async () => {
    authorize({ id: 1, login: 'stepa' })

    const res = await request(app).get('/forum/topics/999999')

    expect(res.status).toBe(404)
  })
})
