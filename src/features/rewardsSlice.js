import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
}

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