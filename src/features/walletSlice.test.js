import { describe, it, expect } from 'vitest'
import reducer, { setPoints, addPoints } from './walletSlice.js'

describe('wallet reducer', () => {
  it('handles initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.points).toBe(0)
  })

  it('sets points', () => {
    const state = reducer(undefined, setPoints(100))
    expect(state.points).toBe(100)
  })

  it('adds points', () => {
    const state = reducer({ points: 5 }, addPoints(10))
    expect(state.points).toBe(15)
  })
})