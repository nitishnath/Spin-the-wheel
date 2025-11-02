import { http, HttpResponse } from 'msw'
import { deterministicIndex, rewardPool } from '../lib/reward.js'
import { colorPointsMap } from '../lib/colorPoints.js'

// In-memory state for mock server, scoped per mobile number
let mockUser = null
const db = new Map() // mobile -> { walletPoints: number, rewards: array }

// Helper function to ensure user state exists in the mock database
function ensureUserState(mobile) {
  const key = String(mobile || '')
  if (!key) return null
  if (!db.has(key)) {
    db.set(key, { walletPoints: 100, rewards: [] })
  }
  return db.get(key)
}

// Mock handlers for login, OTP verification, profile, wallet, and rewards endpoints
export const handlers = [

  // Mock login endpoint
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    const { mobile } = body || {}
    if (!mobile) return HttpResponse.json({ error: 'mobile required' }, { status: 400 })
    // Accept any mobile, proceed to OTP step
    mockUser = { name: 'Player One', mobile }
    ensureUserState(mobile)
    return HttpResponse.json({ ok: true })
  }),

  // Mock OTP verification endpoint
  http.post('/api/verify-otp', async ({ request }) => {
    const body = await request.json()
    const { mobile, otp } = body || {}
    if (!mobile || !otp) return HttpResponse.json({ error: 'invalid' }, { status: 400 })
    if (String(otp) !== '123456') return HttpResponse.json({ error: 'wrong_otp' }, { status: 401 })
    mockUser = { name: 'Player One', mobile }
    ensureUserState(mobile)
    return HttpResponse.json({ user: mockUser })
  }),

  // Mock profile endpoint
  http.get('/api/profile', () => {
    if (!mockUser) return HttpResponse.json({ error: 'unauth' }, { status: 401 })
    return HttpResponse.json({ user: mockUser })
  }),

  // Mock wallet endpoint
  http.get('/api/wallet', () => {
    const mobile = mockUser?.mobile
    const state = ensureUserState(mobile)
    if (!state) return HttpResponse.json({ error: 'unauth' }, { status: 401 })
    return HttpResponse.json({ points: state.walletPoints })
  }),

  // Mock rewards endpoint
  http.get('/api/rewards', () => {
    const mobile = mockUser?.mobile
    const state = ensureUserState(mobile)
    if (!state) return HttpResponse.json({ error: 'unauth' }, { status: 401 })
    return HttpResponse.json({ rewards: state.rewards })
  }),

  // Mock game play endpoint
  http.post('/api/game/play', async ({ request }) => {
    const body = await request.json().catch(() => ({}))
    const mobile = body?.mobile || mockUser?.mobile
    const state = ensureUserState(mobile)
    if (!state) return HttpResponse.json({ error: 'unauth' }, { status: 401 })
    // If FE sends a color name, award points based on color
    const colorName = typeof body?.colorName === 'string' ? body.colorName : null
    if (colorName && colorPointsMap[colorName] != null) {
      const pts = colorPointsMap[colorName]
      const item = {
        id: Date.now(),
        label: colorName,
        points: pts,
        status: pts > 0 ? 'earned' : 'pending',
        timestamp: new Date().toISOString(),
      }
      state.rewards = [item, ...state.rewards]
      state.walletPoints += pts
      return HttpResponse.json({ reward: item, wallet: { points: state.walletPoints } })
    }
    // Fallback: deterministic backend reward if no color provided
    const idx = deterministicIndex(mobile, rewardPool.length)
    const reward = rewardPool[idx]
    const item = {
      id: Date.now(),
      label: reward.label,
      points: reward.points,
      status: reward.points > 0 ? 'earned' : 'pending',
      timestamp: new Date().toISOString(),
    }
    state.rewards = [item, ...state.rewards]
    state.walletPoints += reward.points
    return HttpResponse.json({ reward: item, wallet: { points: state.walletPoints } })
  }),
]