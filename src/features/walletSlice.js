import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  points: 0,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setPoints(state, action) {
      state.points = action.payload
    },
    addPoints(state, action) {
      state.points += action.payload
    },
  },
})

export const { setPoints, addPoints } = walletSlice.actions
export default walletSlice.reducer