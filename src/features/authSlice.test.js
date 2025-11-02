import { describe, it, expect } from 'vitest'
import reducer, { setMobile, loginSuccess, logout, setSessionPlayed } from './authSlice.js'

describe('auth reducer', () => {
  it('handles initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.mobile).toBe('')
    expect(state.sessionPlayed).toBe(false)
  })

  it('sets mobile', () => {
    const state = reducer(undefined, setMobile('9999999999'))
    expect(state.mobile).toBe('9999999999')
  })

  it('loginSuccess authenticates and resets sessionPlayed', () => {
    const user = { name: 'Player', mobile: '1234567890' }
    const state = reducer({ isAuthenticated: false, user: null, mobile: '', sessionPlayed: true }, loginSuccess(user))
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.sessionPlayed).toBe(false)
  })

  it('logout resets state', () => {
    const prev = { isAuthenticated: true, user: { name: 'X' }, mobile: '1112223333', sessionPlayed: true }
    const state = reducer(prev, logout())
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.mobile).toBe('')
    expect(state.sessionPlayed).toBe(false)
  })

  it('sets session played', () => {
    const state = reducer(undefined, setSessionPlayed(true))
    expect(state.sessionPlayed).toBe(true)
  })
})