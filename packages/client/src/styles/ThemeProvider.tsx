import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createGlobalStyle } from 'styled-components'
import * as themeApi from '../api/themeApi'
import { ThemeName } from '../api/themeApi'
import { useSelector } from '../store'
import { palettes } from './theme'

const ThemeVariables = createGlobalStyle<{ $theme: ThemeName }>`
  :root {
    color-scheme: ${({ $theme }) => $theme};
    ${({ $theme }) =>
      Object.entries(palettes[$theme])
        .map(([name, value]) => `--color-${name}: ${value};`)
        .join('\n')}
  }
`

const ThemeContext = createContext<{
  theme: ThemeName
  busy: boolean
  error: string | null
  toggle: () => void
} | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const userId = useSelector(state => state.user.data?.id)
  const sessionChecked = useSelector(state => state.auth.sessionChecked)
  const [theme, setTheme] = useState<ThemeName>('light')
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const generation = useRef(0)
  const saving = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    generation.current += 1
    saving.current = false
    setBusy(true)
    setError(null)
    if (!sessionChecked) return () => controller.abort()

    themeApi
      .getCurrentTheme(controller.signal)
      .then(result => {
        if (!controller.signal.aborted) setTheme(result.theme)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setTheme('light')
          setError('Не удалось загрузить тему')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusy(false)
      })

    return () => {
      controller.abort()
      generation.current += 1
    }
  }, [userId, sessionChecked])

  const toggle = async () => {
    if (busy || saving.current) return
    const previous = theme
    const next = theme === 'light' ? 'dark' : 'light'
    const currentGeneration = generation.current
    saving.current = true
    setTheme(next)
    setBusy(true)
    setError(null)
    try {
      const result = await themeApi.setCurrentTheme(next)
      if (generation.current === currentGeneration) setTheme(result.theme)
    } catch {
      if (generation.current === currentGeneration) {
        setTheme(previous)
        setError('Не удалось сохранить тему. Попробуйте ещё раз.')
      }
    } finally {
      if (generation.current === currentGeneration) {
        saving.current = false
        setBusy(false)
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, busy, error, toggle }}>
      <ThemeVariables $theme={theme} />
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('ThemeProvider is required')
  return value
}
