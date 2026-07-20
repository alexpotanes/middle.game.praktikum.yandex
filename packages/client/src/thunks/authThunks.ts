import { createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../api/authApi'
import {
  ApiError,
  SignInRequest,
  SignUpRequest,
  UserResponse,
} from '../api/types'

export const loginThunk = createAsyncThunk<
  UserResponse,
  SignInRequest,
  { rejectValue: string }
>('auth/login', async (creds, { rejectWithValue }) => {
  try {
    await authApi.signIn(creds)
    return await authApi.getUser()
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const registerThunk = createAsyncThunk<
  UserResponse,
  SignUpRequest,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    await authApi.signUp(data)
    return await authApi.getUser()
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

export const fetchCurrentUserThunk = createAsyncThunk<UserResponse>(
  'auth/fetchCurrentUser',
  async () => authApi.getUser(),
)
