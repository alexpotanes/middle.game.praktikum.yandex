import { createAsyncThunk } from '@reduxjs/toolkit'
import { SERVER_HOST } from '../constants'

export interface Friend {
  name: string
  secondName: string
  avatar: string
}

export const fetchFriendsThunk = createAsyncThunk(
  'user/fetchFriendsThunk',
  async () => {
    const url = `${SERVER_HOST}/friends`
    return fetch(url).then(res => res.json())
  },
)
