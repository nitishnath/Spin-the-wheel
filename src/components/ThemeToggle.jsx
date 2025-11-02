import styles from './ThemeToggle.module.scss';
import { useTheme } from '../theme/useTheme.js';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={styles.wrap}>
      <button
        className={`toggle ${styles.switch}`}
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle theme"
        data-state={isLight ? 'light' : 'dark'}
        onClick={toggle}
      >
        <span className={styles.knob} />
      </button>
      <span className={styles.label}>{isLight ? 'Light' : 'Dark'}</span>
    </div>
  );
}