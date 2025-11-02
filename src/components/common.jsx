import { useNavigate } from 'react-router-dom'
import styles from './common.module.scss'

export const Common = () => {

    const navigate = useNavigate()

  return (
   <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">←</button>
  )
}
