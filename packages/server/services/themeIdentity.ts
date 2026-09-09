import { verifyPraktikumSession } from './sessionVerifier'

// ID из тела или query никогда не используется для выбора владельца.
export const resolveThemeOwner = async (
  cookie?: string
): Promise<number | null> => {
  const user = await verifyPraktikumSession(cookie)

  return user?.id ?? null
}
