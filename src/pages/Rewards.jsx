import { useAppSelector } from '../store/hooks.js'
import { Common } from '../components/common.jsx'

import styles from './Rewards.module.scss'

export default function Rewards() {
  const rewards = useAppSelector((s) => s.rewards.list)

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Common />
        <h1 className={styles.title}>Rewards History</h1>
      </header>
      <section className={styles.card}>
        {rewards.length === 0 ? (
          <p className={styles.hint}>No rewards yet. Play the game to earn some!</p>
        ) : (
          <ul className={styles.rewards}>
            {rewards.map((r) => (
              <li key={r.id} className={styles['reward-item']}>
                <div className={styles['reward-main']}>
                  <span className={styles['reward-label']}>{r.label}</span>
                  <span className={`${styles.chip} ${r.points > 0 ? styles.earned : styles.pending}`}>{r.points > 0 ? 'earned' : 'pending'}</span>
                </div>
                <div className={styles['reward-sub']}>
                  <time dateTime={r.timestamp}>{new Date(r.timestamp).toLocaleString()}</time>
                  <span className={styles['points-delta']}>+{r.points} pts</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}