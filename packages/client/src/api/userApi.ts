import { request } from './http'
import { ChangePasswordRequest, ProfileRequest, UserResponse } from './types'

export const updateProfile = (data: ProfileRequest) =>
  request<UserResponse>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const changePassword = (data: ChangePasswordRequest) =>
  request<string>('/user/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const updateAvatar = (avatar: File) => {
  const data = new FormData()
  data.append('avatar', avatar)

  return request<UserResponse>('/user/profile/avatar', {
    method: 'PUT',
    body: data,
  })
}
