import { RefObject, useCallback, useEffect, useState } from 'react'

type FullscreenControls = {
  isFullscreen: boolean
  enterFullscreen: () => Promise<void>
  exitFullscreen: () => Promise<void>
  toggleFullscreen: () => Promise<void>
}

const getFullscreenElement = (): Element | null => {
  if (typeof document === 'undefined') {
    return null
  }

  return document.fullscreenElement ?? null
}

export const useFullscreen = (
  targetRef?: RefObject<HTMLElement>
): FullscreenControls => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () => getFullscreenElement() !== null
  )

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(getFullscreenElement() !== null)
    }

    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('fullscreenerror', handleChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('fullscreenerror', handleChange)
    }
  }, [])

  const enterFullscreen = useCallback(async () => {
    if (getFullscreenElement()) {
      return
    }

    const target = targetRef?.current ?? document.documentElement
    await target.requestFullscreen()
  }, [targetRef])

  const exitFullscreen = useCallback(async () => {
    if (!getFullscreenElement()) {
      return
    }

    await document.exitFullscreen()
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (getFullscreenElement()) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }, [enterFullscreen, exitFullscreen])

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
