import { loginSuccess } from '../features/authSlice.js'
import { setPoints } from '../features/walletSlice.js'
import { setRewards } from '../features/rewardsSlice.js'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks.js'
import styles from './OTP.module.scss'

export default function OTP() {
  const mobile = useAppSelector((s) => s.auth.mobile)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!mobile) navigate('/login')
  }, [mobile, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.trim() !== '123456') {
      setError('OTP must be 123456 for this demo')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      })
      if (!res.ok) throw new Error('OTP verify failed')
      const data = await res.json()
      dispatch(loginSuccess(data.user))
      const [walletRes, rewardsRes] = await Promise.all([
        fetch('/api/wallet'),
        fetch('/api/rewards'),
      ])
      const walletData = await walletRes.json()
      const rewardsData = await rewardsRes.json()
      dispatch(setPoints(walletData.points))
      dispatch(setRewards(rewardsData.rewards))
      navigate('/')
    } catch {
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Enter OTP</h1>
      <p className={styles.subtitle}>Sent to {mobile}</p>
      <form onSubmit={onSubmit} className={styles.card} aria-label="OTP form">
        <label htmlFor="otp">One-Time Password</label>
        <input
          id="otp"
          name="otp"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? styles['otp-error'] : undefined}
        />
        {error && (
          <div id={styles['otp-error']} role="alert" className={styles.error}>
            {error}
          </div>
        )}
        <button type="submit" className={styles.button} disabled={loading} aria-busy={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </main>
  )
}