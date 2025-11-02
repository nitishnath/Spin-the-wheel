import { useState } from 'react'
import { addReward } from '../features/rewardsSlice.js'
import { addPoints } from '../features/walletSlice.js'
import { logout, setSessionPlayed } from '../features/authSlice.js'
import SpinWheel from '../components/SpinWheel.jsx'
import { useAppDispatch, useAppSelector } from '../store/hooks.js'
import styles from './Play.module.scss'

export default function Play() {
  const mobile = useAppSelector((s) => s.auth.mobile)
  const played = useAppSelector((s) => s.auth.sessionPlayed)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  async function performPlay(selection) {
    setLoading(true)
    try {
      const res = await fetch('/api/game/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, colorName: selection?.name }),
      })
      const data = await res.json()
      const reward = data.reward
      dispatch(addReward(reward))
      dispatch(addPoints(reward.points))
      dispatch(setSessionPlayed(true))
      setToast(`You got: ${reward.label} +${reward.points}`)
    } catch {
      setToast('Failed to play. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Spin the Wheel</h1>
      <div className={styles.card}>
        <SpinWheel onSpinEnd={performPlay} disabled={played || loading} />
        {played && (
          <div>
            <p className={styles.hint} role="status">Only one play per session. Come back after re-login.</p>
            <button className="button" onClick={() => dispatch(logout())}>Logout</button>
          </div>
        )}
        {toast && <div className={styles.toast} role="alert" aria-live="polite">{toast}</div>}
      </div>
    </main>
  )
}