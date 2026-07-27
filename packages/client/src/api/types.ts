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
  display_name: string
  login: string
  email: string
  phone: string
  avatar: string
}

export interface ApiError {
  reason: string
}
