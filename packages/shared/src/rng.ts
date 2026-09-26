export const mulberry32 = (state: number): { value: number; state: number } => {
  const next = (state + 0x6d2b79f5) | 0
  let t = next
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return { value, state: next }
}

export const shuffleWithSeed = <T>(
  items: T[],
  rngState: number
): { items: T[]; rngState: number } => {
  const result = [...items]
  let state = rngState
  for (let i = result.length - 1; i > 0; i--) {
    const { value, state: next } = mulberry32(state)
    state = next
    const j = Math.floor(value * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return { items: result, rngState: state }
}
