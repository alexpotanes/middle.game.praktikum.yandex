import { createAsyncThunk } from '@reduxjs/toolkit'
import { SERVER_HOST } from '../constants'

export interface User {
  name: string
  secondName: string
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async () => {
    const url = `${SERVER_HOST}/user`
    return fetch(url).then(res => res.json())
  }
)
