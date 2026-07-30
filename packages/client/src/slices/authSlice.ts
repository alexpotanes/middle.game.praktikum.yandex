import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { STATUS, Status } from './constants'
import {
  fetchCurrentUserThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from '../thunks/authThunks'

export interface AuthState {
  isAuthenticated: boolean
  sessionChecked: boolean
  status: Status
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  sessionChecked: false,
  status: STATUS.IDLE,
  error: null,
}

const setAuthenticated = (state: AuthState) => {
  state.status = STATUS.SUCCEEDED
  state.isAuthenticated = true
  state.sessionChecked = true
  state.error = null
}

const setLoading = (state: AuthState) => {
  state.status = STATUS.LOADING
  state.error = null
}

const clearAuthenticated = (state: AuthState) => {
  state.status = STATUS.FAILED
  state.isAuthenticated = false
  state.sessionChecked = true
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, setLoading)
      .addCase(loginThunk.fulfilled, setAuthenticated)
      .addCase(loginThunk.rejected, (state, action) => {
        clearAuthenticated(state)
        state.error = action.payload ?? 'Не удалось войти'
      })
      .addCase(registerThunk.pending, setLoading)
      .addCase(registerThunk.fulfilled, setAuthenticated)
      .addCase(registerThunk.rejected, (state, action) => {
        clearAuthenticated(state)
        state.error = action.payload ?? 'Не удалось зарегистрироваться'
      })
      .addCase(fetchCurrentUserThunk.pending, setLoading)
      .addCase(fetchCurrentUserThunk.fulfilled, setAuthenticated)
      .addCase(fetchCurrentUserThunk.rejected, clearAuthenticated)
      .addCase(logoutThunk.fulfilled, state => {
        state.status = STATUS.IDLE
        state.isAuthenticated = false
        state.sessionChecked = true
        state.error = null
      })
  },
})

export const { clearAuthError } = authSlice.actions

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectSessionChecked = (state: RootState) =>
  state.auth.sessionChecked
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error

export default authSlice.reducer
