import { getUser } from './authService'
import { AppError } from '../utils/errors'

// ID из тела или query никогда не используется для выбора владельца.
export const resolveThemeOwner = async (
  cookie?: string
): Promise<number | null> => {
  if (!cookie || !/(?:^|;\s*)(?:authCookie|uuid)=/.test(cookie)) return null

  try {
    const result = await getUser(cookie)
    if (result.status === 401) return null
    const user = result.data as { id?: unknown } | null
    if (
      result.status === 200 &&
      typeof user?.id === 'number' &&
      Number.isSafeInteger(user.id) &&
      user.id > 0
    ) {
      return user.id
    }
  } catch {
    // Сбой авторизации не должен превращать пользователя в гостя.
  }
  throw new AppError(
    502,
    'Не удалось проверить сессию',
    'AUTH_SERVICE_UNAVAILABLE'
  )
}
