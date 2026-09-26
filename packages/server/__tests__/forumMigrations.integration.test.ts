import { execSync } from 'child_process'
import path from 'path'
import { Comment, Reaction, Topic, sequelize } from '../models'

/**
 * Смоук-тест реальных файлов миграций на настоящем Postgres.
 *
 * В отличие от forumModels.test.ts/forumRoutes.test.ts, которые поднимают
 * схему через sequelize.sync() на sqlite in-memory (т.е. проверяют только
 * то, что описано в декораторах моделей), этот тест реально накатывает
 * packages/server/migrations тем же sequelize-cli, который выполняет
 * docker-entrypoint.sh перед стартом сервера в проде. Это ловит рассинхрон
 * между моделями и миграциями и проверяет DB-constraint'ы, которые sync()
 * на sqlite не воспроизводит (составной FK topicId+parentId, ON DELETE
 * CASCADE).
 *
 * Запуск: `yarn test:integration` (см. package.json). Нужен реальный
 * Postgres, доступный по POSTGRES_* переменным окружения - см. .env.sample.
 *
 * ВАЖНО: тест откатывает и накатывает все миграции (db:migrate:undo:all +
 * db:migrate) и очищает таблицы форума между кейсами. Не запускайте его
 * на БД с реальными данными - используйте отдельную/одноразовую БД
 * (например, поднятую в CI или через `docker compose up postgres`
 * с отдельным POSTGRES_DB).
 */

const serverRoot = path.resolve(__dirname, '..')

const runCli = (command: string) =>
  execSync(`yarn ${command}`, {
    cwd: serverRoot,
    stdio: process.env.DEBUG_MIGRATIONS ? 'inherit' : 'pipe',
    env: process.env,
  })

describe('forum migrations (real Postgres)', () => {
  beforeAll(() => {
    // На случай, если предыдущий прогон упал до cleanup - откатываем всё,
    // не считая ошибкой ситуацию "и так пусто".
    try {
      runCli('db:migrate:undo:all')
    } catch {
      // база уже пустая - нормальная ситуация
    }

    runCli('db:migrate')
  })

  afterAll(async () => {
    try {
      runCli('db:migrate:undo:all')
    } finally {
      await sequelize.close()
    }
  })

  afterEach(async () => {
    // TRUNCATE ... CASCADE на topics утаскивает за собой comments и
    // reactions по FK - отдельно чистить остальные таблицы не нужно.
    await Topic.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    })
  })

  const createTopic = () =>
    Topic.create({
      title: 'Интеграционный топик',
      message: 'Текст топика',
      authorId: 1,
      authorLogin: 'stepa',
    })

  it('создаёт топик, комментарий верхнего уровня и вложенный ответ', async () => {
    const topic = await createTopic()

    const comment = await Comment.create({
      topicId: topic.id,
      parentId: null,
      message: 'Комментарий верхнего уровня',
      authorId: 1,
      authorLogin: 'stepa',
    })

    const reply = await Comment.create({
      topicId: topic.id,
      parentId: comment.id,
      message: 'Ответ на комментарий',
      authorId: 2,
      authorLogin: 'vasya',
    })

    expect(reply.topicId).toBe(topic.id)
    expect(reply.parentId).toBe(comment.id)
  })

  it('не позволяет создать ответ, у которого topicId не совпадает с topicId родителя', async () => {
    const topicA = await createTopic()
    const topicB = await Topic.create({
      title: 'Другой топик',
      message: 'Текст другого топика',
      authorId: 1,
      authorLogin: 'stepa',
    })

    const commentInTopicA = await Comment.create({
      topicId: topicA.id,
      parentId: null,
      message: 'Комментарий в топике A',
      authorId: 1,
      authorLogin: 'stepa',
    })

    // Такое поведение не должен допускать текущий контроллер (он берёт
    // topicId из родителя), но проверяем, что БД тоже не даст записать
    // некорректную комбинацию - составной FK на (topicId, parentId).
    await expect(
      Comment.create({
        topicId: topicB.id,
        parentId: commentInTopicA.id,
        message: 'Подложный ответ из чужого топика',
        authorId: 2,
        authorLogin: 'vasya',
      })
    ).rejects.toThrow()
  })

  it('удаляет комментарии, ответы и реакции каскадом при удалении топика', async () => {
    const topic = await createTopic()
    const comment = await Comment.create({
      topicId: topic.id,
      parentId: null,
      message: 'Комментарий',
      authorId: 1,
      authorLogin: 'stepa',
    })
    const reply = await Comment.create({
      topicId: topic.id,
      parentId: comment.id,
      message: 'Ответ',
      authorId: 1,
      authorLogin: 'stepa',
    })
    await Reaction.create({ commentId: reply.id, userId: 1, emoji: '👍' })

    await topic.destroy()

    expect(await Comment.count({ where: { topicId: topic.id } })).toBe(0)
    expect(await Reaction.count({ where: { commentId: reply.id } })).toBe(0)
  })
})
