export interface SignInRequest {
  login: string
  password: string
}

export interface SignUpRequest {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export interface UserResponse {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
  avatar: string | null
}

export interface ProfileRequest {
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface ApiError {
  reason: string
}

export interface YandexServiceIdResponse {
  service_id: string
  auth_url: string
}

export interface YandexOAuthRequest {
  code: string
  redirect_uri: string
}

export interface ForumTopic {
  id: number
  title: string
  message: string
  authorId: number
  authorLogin: string
  createdAt: string
  updatedAt: string
}

export interface ForumComment {
  id: number
  topicId: number
  parentId: number | null
  authorId: number
  authorLogin: string
  message: string
  createdAt: string
  updatedAt: string
}

export interface ForumCommentNode extends ForumComment {
  replies: ForumCommentNode[]
}

export interface ForumTopicsResponse {
  topics: ForumTopic[]
  total: number
  limit: number
  offset: number
}

export interface ForumTopicDetailsResponse {
  topic: ForumTopic
  comments: ForumCommentNode[]
}

export interface CreateForumTopicRequest {
  title: string
  message: string
}

export interface CreateForumCommentRequest {
  message: string
}
