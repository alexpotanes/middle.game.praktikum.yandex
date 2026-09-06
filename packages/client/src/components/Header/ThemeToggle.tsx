import { useTheme } from '../../styles/ThemeProvider'
import { FullscreenToggle } from './styles'
import { Control, ErrorText } from './ThemeToggle.styles'

export const ThemeToggle = () => {
  const { theme, busy, error, toggle } = useTheme()
  return (
    <Control>
      <FullscreenToggle
        type="button"
        aria-label="Тёмная тема"
        aria-pressed={theme === 'dark'}
        disabled={busy}
        onClick={toggle}>
        {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      </FullscreenToggle>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Control>
  )
}
