const light = {
  header: '#564844',
  bg: '#fcf5e5',
  text: '#1b1b1b',
  heading: '#564844',
  onHeader: '#f5f2ef',
  gold: '#c9a24c',
  goldLight: '#e8c877',
  crimson: '#7c2626',
  success: '#2f6b45',
  surface: '#ffffff',
  surfaceMuted: 'rgba(255, 255, 255, 0.55)',
  muted: '#6f625e',
  border: 'rgba(86, 72, 68, 0.2)',
}

const dark = {
  header: '#332b29',
  bg: '#211d1b',
  text: '#efe6d6',
  heading: '#e8c877',
  onHeader: '#f5f2ef',
  gold: '#c9a24c',
  goldLight: '#e8c877',
  crimson: '#d97575',
  success: '#87c99a',
  surface: '#302a27',
  surfaceMuted: '#38302b',
  muted: '#bcb0a5',
  border: 'rgba(232, 200, 119, 0.25)',
}

export const palettes = {
  light,
  dark,
}

// Fallback сохраняет светлую палитру при отдельном рендере компонентов.
export const colors = Object.fromEntries(
  Object.entries(light).map(([name, value]) => [
    name,
    `var(--color-${name}, ${value})`,
  ])
) as Record<keyof typeof light, string>

export const shadows = {
  card: '0 10px 24px rgba(0, 0, 0, 0.12)',
  inset: 'inset 0 0 0 1px rgba(86, 72, 68, 0.2)',
}
