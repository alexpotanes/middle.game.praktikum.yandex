import { useEffect, useState } from 'react'

import { FullscreenToggle } from './styles'

export const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFullscreenAvailable, setIsFullscreenAvailable] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    setIsFullscreenAvailable(Boolean(document.fullscreenEnabled))
    handleFullscreenChange()

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      return
    }

    document.exitFullscreen()
  }

  return (
    <FullscreenToggle
      type="button"
      onClick={handleFullscreenToggle}
      disabled={!isFullscreenAvailable}
      aria-pressed={isFullscreen}>
      {isFullscreen ? 'Свернуть экран' : 'Во весь экран'}
    </FullscreenToggle>
  )
}
