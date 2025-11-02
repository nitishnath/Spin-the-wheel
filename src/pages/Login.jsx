import { setMobile } from '../features/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch } from '../store/hooks.js'
import styles from './Login.module.scss'

export default function Login() {
  const [mobile, setMobileInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const normalized = mobile.trim()
    if (!/^\d{10}$/.test(normalized)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: normalized }),
      })
      if (!res.ok) throw new Error('Login failed')
      dispatch(setMobile(normalized))
      navigate('/otp')
    } catch {
      setError('Could not start login. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1 className="title">Welcome</h1>
      <p className="subtitle">Login with your mobile number</p>
      <form onSubmit={onSubmit} className="card" aria-label="Login form">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          id="mobile"
          name="mobile"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="tel"
          placeholder="e.g. 9876543210"
          value={mobile}
          onChange={(e) => setMobileInput(e.target.value)}
          aria- invalid={!!error}
          aria-describedby={error ? 'mobile-error' : undefined}
        />
        {error && (
          <div id="mobile-error" role="alert" className={styles.error}>
            {error}
          </div>
        )}
        <button type="submit" className={styles.button} disabled={loading} aria-busy={loading}>
          {loading ? 'Submitting…' : 'Continue'}
        </button>
      </form>
    </main>
  )
}