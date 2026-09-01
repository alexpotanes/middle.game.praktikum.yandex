import { createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../api/authApi'
import * as oauthApi from '../api/oauthApi'
import {
  ApiError,
  SignInRequest,
  SignUpRequest,
  UserResponse,
} from '../api/types'
import { getYandexRedirectUri } from '../utils/oauth'

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
  async () => authApi.getUser()
)

export const startYandexOAuthThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/startYandexOAuth', async (_, { rejectWithValue }) => {
  try {
    const redirectUri = getYandexRedirectUri()
    const { auth_url } = await oauthApi.getYandexServiceId(redirectUri)
    document.location.href = auth_url
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})

export const loginWithYandexThunk = createAsyncThunk<
  UserResponse,
  { code: string },
  { rejectValue: string }
>('auth/loginWithYandex', async ({ code }, { rejectWithValue }) => {
  try {
    await oauthApi.signInWithYandexCode({
      code,
      redirect_uri: getYandexRedirectUri(),
    })
    return await authApi.getUser()
  } catch (e) {
    return rejectWithValue((e as ApiError).reason)
  }
})
