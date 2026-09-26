import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftState,
  MatchState,
  PlayerIndex,
  WinReason,
} from '@warchest/shared'

export type MatchStatus = 'idle' | 'searching' | 'draft' | 'playing' | 'ended'

interface MatchSliceState {
  status: MatchStatus
  you: PlayerIndex | null
  matchId: string | null
  draft: DraftState | null
  state: MatchState | null
  endResult: { winner: PlayerIndex; reason: WinReason } | null
  error: string | null
}

const initialState: MatchSliceState = {
  status: 'idle',
  you: null,
  matchId: null,
  draft: null,
  state: null,
  endResult: null,
  error: null,
}

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setSearching(state) {
      state.status = 'searching'
      state.error = null
    },
    draftStarted(
      state,
      action: PayloadAction<{ you: PlayerIndex; state: DraftState }>
    ) {
      state.status = 'draft'
      state.you = action.payload.you
      state.draft = action.payload.state
      state.error = null
    },
    matchStarted(
      state,
      action: PayloadAction<{
        matchId: string
        you: PlayerIndex
        state: MatchState
      }>
    ) {
      state.status = 'playing'
      state.matchId = action.payload.matchId
      state.you = action.payload.you
      state.draft = null
      state.state = action.payload.state
      state.endResult = null
    },
    stateUpdated(state, action: PayloadAction<MatchState>) {
      state.state = action.payload
    },
    matchEnded(
      state,
      action: PayloadAction<{ winner: PlayerIndex; reason: WinReason }>
    ) {
      state.status = 'ended'
      state.endResult = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    resetMatch() {
      return initialState
    },
  },
})

export const {
  setSearching,
  draftStarted,
  matchStarted,
  stateUpdated,
  matchEnded,
  setError,
  resetMatch,
} = matchSlice.actions

export default matchSlice.reducer
