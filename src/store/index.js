import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import walletReducer from '../features/walletSlice.js'
import rewardsReducer from '../features/rewardsSlice.js'

function loadPersisted() {
  try {
    const raw = localStorage.getItem('session')
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

function savePersisted(state) {
  try {
    const minimal = {
      auth: { isAuthenticated: state.auth.isAuthenticated, user: state.auth.user, sessionPlayed: state.auth.sessionPlayed },
    }
    localStorage.setItem('session', JSON.stringify(minimal))
  } catch {
    // ignore
  }
}

const preloaded = loadPersisted()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    rewards: rewardsReducer,
  },
  preloadedState: preloaded,
})

store.subscribe(() => {
  savePersisted(store.getState())
})

export default store