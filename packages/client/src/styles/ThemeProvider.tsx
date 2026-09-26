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

    const loadTheme = async () => {
      let loadedTheme: ThemeName = 'light'
      let loadError: string | null = null

      try {
        const result = await themeApi.getCurrentTheme(controller.signal)
        loadedTheme = result.theme
      } catch {
        loadError = 'Не удалось загрузить тему'
      }

      if (controller.signal.aborted) {
        return
      }

      setTheme(loadedTheme)
      setError(loadError)
      setBusy(false)
    }

    void loadTheme()

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
    let savedTheme = previous
    let saveError: string | null = null
    try {
      const result = await themeApi.setCurrentTheme(next)
      savedTheme = result.theme
    } catch {
      saveError = 'Не удалось сохранить тему. Попробуйте ещё раз.'
    }

    if (generation.current !== currentGeneration) return
    setTheme(savedTheme)
    setError(saveError)
    saving.current = false
    setBusy(false)
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
