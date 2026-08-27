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
}

export interface YandexOAuthRequest {
  code: string
  redirect_uri: string
}
