import { describe, it, expect } from 'vitest'
import { deterministicIndex, rewardPool } from './reward.js'

describe('reward calculation', () => {
  it('computes deterministic index from mobile digits', () => {
    const idx = deterministicIndex('9876543210', rewardPool.length)
    // sum of digits 9+8+...+0 = 45, 45 % 5 = 0
    expect(idx).toBe(0)
    expect(rewardPool[idx].label).toBe('10 Points')
  })

  it('handles non-digit characters and empty gracefully', () => {
    expect(deterministicIndex('(123) 456-7890', rewardPool.length)).toBe((1+2+3+4+5+6+7+8+9+0) % rewardPool.length)
    expect(deterministicIndex('', rewardPool.length)).toBe(0)
  })

  it('returns 0 when pool length is 0', () => {
    expect(deterministicIndex('9999999999', 0)).toBe(0)
  })
})