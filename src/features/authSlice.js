import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  user: null,
  mobile: '',
  sessionPlayed: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobile(state, action) {
      state.mobile = action.payload
    }
    ,
    loginSuccess(state, action) {
      state.isAuthenticated = true
      state.user = action.payload
      state.sessionPlayed = false
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.mobile = ''
      state.sessionPlayed = false
    },
    setSessionPlayed(state, action) {
      state.sessionPlayed = action.payload
    },
  },
})

export const { setMobile, loginSuccess, logout, setSessionPlayed } = authSlice.actions
export default authSlice.reducer