import { ValidationError } from './errors'
import { sanitizePlainText } from './sanitize'

const MAX_TITLE_LENGTH = 200
const MAX_TOPIC_MESSAGE_LENGTH = 10000
const MAX_COMMENT_MESSAGE_LENGTH = 5000

const asString = (value: unknown, field: string): string => {
  if (typeof value !== 'string') {
    throw new ValidationError(
      `Поле "${field}" обязательно и должно быть строкой`
    )
  }
  return value
}

export type TopicInput = {
  title: string
  message: string
}

export const validateTopicInput = (body: unknown): TopicInput => {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Некорректное тело запроса')
  }

  const { title, message } = body as Record<string, unknown>

  const cleanTitle = sanitizePlainText(asString(title, 'title'))
  const cleanMessage = sanitizePlainText(asString(message, 'message'))

  if (!cleanTitle) {
    throw new ValidationError('Заголовок топика не может быть пустым')
  }
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(
      `Заголовок топика не может превышать ${MAX_TITLE_LENGTH} символов`
    )
  }
  if (!cleanMessage) {
    throw new ValidationError('Текст топика не может быть пустым')
  }
  if (cleanMessage.length > MAX_TOPIC_MESSAGE_LENGTH) {
    throw new ValidationError(
      `Текст топика не может превышать ${MAX_TOPIC_MESSAGE_LENGTH} символов`
    )
  }

  return { title: cleanTitle, message: cleanMessage }
}

export type CommentInput = {
  message: string
}

export const validateCommentInput = (body: unknown): CommentInput => {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Некорректное тело запроса')
  }

  const { message } = body as Record<string, unknown>
  const cleanMessage = sanitizePlainText(asString(message, 'message'))

  if (!cleanMessage) {
    throw new ValidationError('Комментарий не может быть пустым')
  }
  if (cleanMessage.length > MAX_COMMENT_MESSAGE_LENGTH) {
    throw new ValidationError(
      `Комментарий не может превышать ${MAX_COMMENT_MESSAGE_LENGTH} символов`
    )
  }

  return { message: cleanMessage }
}

export const parseId = (value: string, field: string): number => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`Некорректный идентификатор "${field}"`)
  }
  return id
}
