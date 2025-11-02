import { useEffect, useMemo, useRef, useState } from 'react'
import './SpinWheel.scss'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Segments map: each segment has a color and name (no numbers shown)
const segments = [
  { color: '#10b981', name: 'Green' },
  { color: '#f59e0b', name: 'Orange' },
  { color: '#ef4444', name: 'Red' },
  { color: '#6366f1', name: 'Indigo' },
  { color: '#22d3ee', name: 'Cyan' },
]

export default function SpinWheel({ onSpinEnd, disabled }) {
  const [spinning, setSpinning] = useState(false)
  const [angle, setAngle] = useState(0)
  const wheelRef = useRef(null)
  const reduced = useMemo(prefersReducedMotion, [])

  useEffect(() => {
    if (!spinning) return
    const el = wheelRef.current
    if (!el) return
    const handler = () => {
      // Compute selected segment based on final angle
      const slice = 360 / segments.length
      const normalized = ((angle % 360) + 360) % 360
      // Wheel rotates clockwise; pointer is at 12 o'clock.
      // Select by reversing rotation and applying start offset already handled in CSS.
      // Compute the angle under the pointer relative to gradient start (12 o'clock)
      const pointerAngle = ((360 - normalized) % 360 + 360) % 360
      // Choose the segment whose angular range contains the pointer.
      // Use a tiny epsilon so exact boundaries resolve to the lower index.
      const epsilon = 0.0001
      const idx = Math.floor((pointerAngle + epsilon) / slice) % segments.length
      const selection = { name: segments[idx].name, color: segments[idx].color }
      setSpinning(false)
      onSpinEnd?.(selection)
    }
    el.addEventListener('transitionend', handler, { once: true })
    return () => el.removeEventListener('transitionend', handler)
  }, [spinning, angle, onSpinEnd])

  const handleSpin = () => {
    if (disabled || spinning) return
    setSpinning(true)
    // Spin 2-4 full rotations plus a random offset 0-360
    const baseTurns = 720 + Math.floor(Math.random() * 720) // 2-4 turns
    const offset = Math.floor(Math.random() * 360)
    const next = angle + baseTurns + offset
    if (reduced) {
      // With reduced motion, jump instantly and finish
      setAngle(next)
      const slice = 360 / segments.length
      const normalized = ((next % 360) + 360) % 360
      const pointerAngle = ((360 - normalized) % 360 + 360) % 360
      const epsilon = 0.0001
      const idx = Math.floor((pointerAngle + epsilon) / slice) % segments.length
      const selection = { name: segments[idx].name, color: segments[idx].color }
      setSpinning(false)
      onSpinEnd?.(selection)
    } else {
      setAngle(next)
    }
  }

  return (
    <div className="wheel-wrap">
      <div className="pointer" aria-hidden="true" />
      <div
        ref={wheelRef}
        className="wheel"
        role="img"
        aria-label="Prize wheel"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {/* No numeric labels; rewards are determined by color only */}
      </div>
      <button
        className="button"
        onClick={handleSpin}
        disabled={disabled || spinning}
        aria-disabled={disabled || spinning}
        aria-label="Spin the wheel"
      >
        {spinning ? 'Spinning…' : 'Spin'}
      </button>
    </div>
  )
}