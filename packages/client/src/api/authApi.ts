import { request } from './http'
import { SignInRequest, SignUpRequest, UserResponse } from './types'

export const signIn = (data: SignInRequest) =>
  request<string>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const signUp = (data: SignUpRequest) =>
  request<{ id: number }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const logout = () => request<string>('/auth/logout', { method: 'POST' })

export const getUser = () =>
  request<UserResponse>('/auth/user', { method: 'GET' })
