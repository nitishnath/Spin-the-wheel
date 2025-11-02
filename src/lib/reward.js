export function deterministicIndex(mobile, len) {
  const digits = String(mobile || '').replace(/\D/g, '')
  let sum = 0
  for (const c of digits) sum += Number(c)
  return len > 0 ? sum % len : 0
}

export const rewardPool = [
  { label: '10 Points', points: 10 },
  { label: '5 Points', points: 5 },
  { label: '20 Points', points: 20 },
  { label: 'No Reward', points: 0 },
  { label: '50 Points', points: 50 },
]