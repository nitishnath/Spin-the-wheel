import { useState } from 'react'
import { addReward } from '../features/rewardsSlice.js'
import { addPoints } from '../features/walletSlice.js'
import { logout, setSessionPlayed } from '../features/authSlice.js'
import SpinWheel from '../components/SpinWheel.jsx'
import { useAppDispatch, useAppSelector } from '../store/hooks.js'
import { celebrate } from '../lib/confetti.js'
import styles from './Play.module.scss'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { Common } from '../components/common.jsx'

export default function Play() {
  const mobile = useAppSelector((s) => s.auth.mobile || '') // Get mobile number from auth slice, default to empty string if undefined
  const played = useAppSelector((s) => s.auth.sessionPlayed || false) // Get sessionPlayed from auth slice, default to false if undefined
  const dispatch = useAppDispatch() // Get dispatch function from Redux store
  const [loading, setLoading] = useState(false) // State to track loading status
  const [toast, setToast] = useState('') || '' // State to track toast message, default to empty string if undefined

  // Function to handle play action
  async function performPlay(selection) {
    setLoading(true)
    try {
      const res = await fetch('/api/game/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, colorName: selection?.name }),
      })
      const data = await res.json()
      const reward = data.reward || {} // Get reward object from response JSON, default to empty object if undefined
      dispatch(addReward(reward)) // Dispatch addReward action with reward object
      dispatch(addPoints(reward.points || 0)) // Dispatch addPoints action with reward points, default to 0 if undefined
      dispatch(setSessionPlayed(true)) // Dispatch setSessionPlayed action with true
      setToast(`You got: ${reward.label || ''} +${reward.points || 0}`) // Set toast message with reward label and points, default to empty string and 0 if undefined
      // Trigger a small celebration for the win
      celebrate({ duration: 1600, particleCount: 120 })
    } catch {
      setToast('Failed to play. Please try again later.') // Set toast message for failed play
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <section className={styles.headerSection}>
          <Common />
          <h1 className={styles.title}>Spin the Wheel</h1>
        </section>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ThemeToggle />
          { played && <button className={styles.logoutButton} onClick={() => dispatch(logout())}>Logout</button>}
        </div>
        </header>
      <div className={styles.card}>
        <SpinWheel onSpinEnd={performPlay} disabled={played || loading} />
        {played && (
          <div>
            <p className={styles.hint} role="status">Only one play per session. Come back after re-login.</p>
          </div>
        )}
        {toast && <div className={styles.toast} role="alert" aria-live="polite">{toast}</div>}
      </div>
    </main>
  )
}