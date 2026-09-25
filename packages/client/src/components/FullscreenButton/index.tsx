import { FC, RefObject } from 'react'

import { useFullscreen } from '../../hooks/useFullscreen'
import { Button } from './styles'

type FullscreenButtonProps = {
  targetRef?: RefObject<HTMLElement>
}

export const FullscreenButton: FC<FullscreenButtonProps> = ({ targetRef }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen(targetRef)

  const label = isFullscreen
    ? 'Выйти из полноэкранного режима'
    : 'Полноэкранный режим'

  return (
    <Button
      type="button"
      aria-label={label}
      aria-pressed={isFullscreen}
      title={label}
      onClick={() => {
        void toggleFullscreen()
      }}>
      {isFullscreen ? '⤡' : '⤢'}
    </Button>
  )
}
