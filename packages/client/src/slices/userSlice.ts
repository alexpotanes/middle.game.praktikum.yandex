import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserResponse } from '../api/types'
import { RootState } from '../store'
import {
  fetchCurrentUserThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from '../thunks/authThunks'
import { updateAvatarThunk, updateProfileThunk } from '../thunks/userThunks'

export interface UserState {
  data: UserResponse | null
}

const initialState: UserState = {
  data: null,
}

const setUser = (
  state: UserState,
  { payload }: PayloadAction<UserResponse>
) => {
  state.data = payload
}

const clearUser = (state: UserState) => {
  state.data = null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginThunk.fulfilled, setUser)
      .addCase(loginThunk.rejected, clearUser)
      .addCase(registerThunk.fulfilled, setUser)
      .addCase(registerThunk.rejected, clearUser)
      .addCase(fetchCurrentUserThunk.fulfilled, setUser)
      .addCase(fetchCurrentUserThunk.rejected, clearUser)
      .addCase(logoutThunk.fulfilled, clearUser)
      .addCase(updateProfileThunk.fulfilled, setUser)
      .addCase(updateAvatarThunk.fulfilled, setUser)
  },
})

export const selectUser = (state: RootState) => state.user.data
export const selectUserAvatar = (state: RootState) =>
  state.user.data?.avatar ?? null
export const selectUserDisplayName = (state: RootState) =>
  state.user.data?.display_name ?? null
export const selectUserLogin = (state: RootState) =>
  state.user.data?.login ?? null
export const selectUserFullName = (state: RootState) => {
  const user = state.user.data

  return user ? `${user.first_name} ${user.second_name}` : null
}

export default userSlice.reducer
