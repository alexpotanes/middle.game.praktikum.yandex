import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { fetchUserThunk, User } from '../thunks/userThunks'

export interface UserState {
  data: User | null
  isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending.type, state => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUserThunk.fulfilled.type,
        (state, { payload }: PayloadAction<User>) => {
          state.data = payload
          state.isLoading = false
        },
      )
      .addCase(fetchUserThunk.rejected.type, state => {
        state.isLoading = false
      })
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
