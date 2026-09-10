import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import friendsReducer from './slices/friendsSlice'
import ssrReducer from './slices/ssrSlice'
import userReducer from './slices/userSlice'
import authReducer from './slices/authSlice'
import matchReducer from './slices/matchSlice'
import leaderboardReducer from './slices/leaderboardSlice'
import forumReducer from './slices/forumSlice'

declare global {
  interface Window {
    APP_INITIAL_STATE: RootState
  }
}

export const reducer = combineReducers({
  friends: friendsReducer,
  ssr: ssrReducer,
  user: userReducer,
  auth: authReducer,
  match: matchReducer,
  leaderboard: leaderboardReducer,
  forum: forumReducer,
})

export type RootState = ReturnType<typeof reducer>

export const createAppStore = (preloadedState?: RootState) =>
  configureStore({
    reducer,
    preloadedState,
  })

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']

export const useDispatch: () => AppDispatch = useDispatchBase
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore: () => AppStore = useStoreBase
