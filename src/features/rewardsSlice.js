import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
}

// Create the rewards slice using createSlice from Redux Toolkit
const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    setRewards(state, action) {
      state.list = action.payload
    },
    addReward(state, action) {
      state.list.unshift(action.payload)
    },
  },
})

export const { setRewards, addReward } = rewardsSlice.actions
export default rewardsSlice.reducer