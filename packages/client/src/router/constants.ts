export const ROUTES = {
  LOGIN: '/signin',
  REGISTRATION: '/signup',
} as const

export const getForumTopicPath = (topicId: string) => `/forum/${topicId}`
