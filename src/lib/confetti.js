// Lightweight helper to trigger a brief confetti celebration
// Uses dynamic import to avoid loading the library until needed
let confettiModulePromise

export async function celebrate(options = {}) {
  const {
    duration = 1500,
    particleCount = 100,
    spread = 90,
    startVelocity = 35,
    scalar = 1,
  } = options

  if (!confettiModulePromise) {
    confettiModulePromise = import('canvas-confetti')
  }
  const confetti = (await confettiModulePromise).default

  const end = Date.now() + duration

  // Initial burst near the top-center
  confetti({
    particleCount,
    spread,
    startVelocity,
    scalar,
    origin: { x: 0.5, y: 0.25 },
    ticks: 120,
    zIndex: 9999,
  })

  // Gentle continuous sprinkle for the remaining duration
  const frame = () => {
    confetti({
      particleCount: 6,
      spread: 120,
      startVelocity: 25,
      scalar,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      ticks: 90,
      zIndex: 9999,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}