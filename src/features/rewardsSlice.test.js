import { describe, it, expect } from 'vitest'
import reducer, { setRewards, addReward } from './rewardsSlice.js'

describe('rewards reducer', () => {
  it('handles initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(Array.isArray(state.list)).toBe(true)
    expect(state.list.length).toBe(0)
  })

  it('sets rewards', () => {
    const items = [{ id: 1 }, { id: 2 }]
    const state = reducer(undefined, setRewards(items))
    expect(state.list).toEqual(items)
  })

  it('adds reward to front', () => {
    const reward = { id: 3 }
    const state = reducer({ list: [{ id: 1 }, { id: 2 }] }, addReward(reward))
    expect(state.list[0]).toEqual(reward)
    expect(state.list).toHaveLength(3)
  })
})