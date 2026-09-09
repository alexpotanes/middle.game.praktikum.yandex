export interface PracticumUser {
  id: number
  login: string
  first_name?: string
  second_name?: string
  display_name?: string | null
  avatar?: string | null
  email?: string
  phone?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: PracticumUser
    }
  }
}

export {}
