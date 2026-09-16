import { createAsyncThunk } from '@reduxjs/toolkit'
import * as userApi from '../api/userApi'
import {
  ApiError,
  ChangePasswordRequest,
  ProfileRequest,
  UserResponse,
} from '../api/types'

export const updateProfileThunk = createAsyncThunk<
  UserResponse,
  ProfileRequest,
  { rejectValue: string }
>('user/updateProfile', async (data, { rejectWithValue }) => {
  try {
    return await userApi.updateProfile(data)
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const changePasswordThunk = createAsyncThunk<
  string,
  ChangePasswordRequest,
  { rejectValue: string }
>('user/changePassword', async (data, { rejectWithValue }) => {
  try {
    return await userApi.changePassword(data)
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const updateAvatarThunk = createAsyncThunk<
  UserResponse,
  File,
  { rejectValue: string }
>('user/updateAvatar', async (avatar, { rejectWithValue }) => {
  try {
    return await userApi.updateAvatar(avatar)
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})
