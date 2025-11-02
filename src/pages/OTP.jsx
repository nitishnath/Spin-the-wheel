import { loginSuccess } from '../features/authSlice.js'
import { setPoints } from '../features/walletSlice.js'
import { setRewards } from '../features/rewardsSlice.js'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks.js'
import styles from './OTP.module.scss'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function OTP() {
  const mobile = useAppSelector((s) => s.auth.mobile) || 'N/A' // Get the mobile number from the auth slice or default to 'N/A'
  const navigate = useNavigate() // Get the navigate function from the React Router DOM
  const dispatch = useAppDispatch() // Get the dispatch function from the Redux store
  const [otp, setOtp] = useState('') // State variable to store the OTP entered by the user
  const [loading, setLoading] = useState(false) // State variable to track loading state
  const [error, setError] = useState('') // State variable to store error messages

  // Effect to redirect to login if mobile number is not available
  useEffect(() => {
    if (!mobile) navigate('/login')
  }, [mobile, navigate])

  // Function to handle form submission
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
      dispatch(loginSuccess(data.user)) // Dispatch loginSuccess action with user data

      // Fetch wallet and rewards data concurrently
      const [walletRes, rewardsRes] = await Promise.all([
        fetch('/api/wallet'),
        fetch('/api/rewards'),
      ])
      const walletData = await walletRes.json() // Parse wallet response JSON
      const rewardsData = await rewardsRes.json() // Parse rewards response JSON
      dispatch(setPoints(walletData.points)) // Dispatch setPoints action with wallet points
      dispatch(setRewards(rewardsData.rewards)) // Dispatch setRewards action with rewards data
      navigate('/') // Redirect to home page
    } catch {
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <header className="header">
        <div>
          <h1 className={styles.title}>Enter OTP</h1>
          <p className={styles.subtitle}>Sent to {mobile}</p>
        </div>
        <ThemeToggle />
      </header>
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