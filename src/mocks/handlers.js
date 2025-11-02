import { http, HttpResponse } from 'msw'
import { deterministicIndex, rewardPool } from '../lib/reward.js'
import { colorPointsMap } from '../lib/colorPoints.js'

// In-memory state for mock server
let mockUser = null
let walletPoints = 100
let rewards = []

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    const { mobile } = body || {}
    if (!mobile) return HttpResponse.json({ error: 'mobile required' }, { status: 400 })
    // Accept any mobile, proceed to OTP step
    mockUser = { name: 'Player One', mobile }
    return HttpResponse.json({ ok: true })
  }),
  http.post('/api/verify-otp', async ({ request }) => {
    const body = await request.json()
    const { mobile, otp } = body || {}
    if (!mobile || !otp) return HttpResponse.json({ error: 'invalid' }, { status: 400 })
    if (String(otp) !== '123456') return HttpResponse.json({ error: 'wrong_otp' }, { status: 401 })
    mockUser = { name: 'Player One', mobile }
    return HttpResponse.json({ user: mockUser })
  }),
  http.get('/api/profile', () => {
    if (!mockUser) return HttpResponse.json({ error: 'unauth' }, { status: 401 })
    return HttpResponse.json({ user: mockUser })
  }),
  http.get('/api/wallet', () => {
    return HttpResponse.json({ points: walletPoints })
  }),
  http.get('/api/rewards', () => {
    return HttpResponse.json({ rewards })
  }),
  http.post('/api/game/play', async ({ request }) => {
    const body = await request.json().catch(() => ({}))
    const mobile = body?.mobile || mockUser?.mobile
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
      rewards = [item, ...rewards]
      walletPoints += pts
      return HttpResponse.json({ reward: item, wallet: { points: walletPoints } })
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
    rewards = [item, ...rewards]
    walletPoints += reward.points
    return HttpResponse.json({ reward: item, wallet: { points: walletPoints } })
  }),
]