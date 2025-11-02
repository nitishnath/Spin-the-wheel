import { Link } from 'react-router-dom'
import { logout } from '../features/authSlice.js'
import { useAppSelector, useAppDispatch } from '../store/hooks.js'
import styles from './Home.module.scss'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Home() {
  const user = useAppSelector((s) => s.auth.user) // Get the user from the auth slice
  const mobile = useAppSelector((s) => s.auth.mobile) || 'N/A' // Get the mobile number from the auth slice or default to 'N/A'
  const points = useAppSelector((s) => s.wallet.points) || 0 // Get the points from the wallet slice or default to 0
  const played = useAppSelector((s) => s.auth.sessionPlayed) || false // Get the sessionPlayed flag from the auth slice or default to false
  const dispatch = useAppDispatch() // Get the dispatch function from the Redux store

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>{user?.name} — {mobile}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ThemeToggle />
          <button className={styles.logoutButton} onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </header>

      <section className={styles.card}>
        <h2>Wallet Points</h2>
        <p className={styles.points} aria-live="polite">{points}</p>
      </section>

      <section className={styles.grid}>
        <Link to="/play" className={`${styles.card} ${styles.action} ${played ? styles.disabled : ''}`} aria-disabled={played}>
          <h3>Spin the Wheel</h3>
          <p>{played ? 'Played this session' : 'Try your luck!'}</p>
        </Link>
        <Link to="/rewards" className={`${styles.card} ${styles.action}`}>
          <h3>Rewards History</h3>
          <p>View your earned rewards</p>
        </Link>
      </section>
    </main>
  )
}