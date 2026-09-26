import { FC } from 'react'

import { useGeolocation } from '../../hooks/useGeolocation'
import { Button, Info } from './styles'

export const GeolocationButton: FC = () => {
  const { coords, error, isLoading, requestLocation } = useGeolocation()

  return (
    <div>
      <Button
        type="button"
        aria-label="Определить местоположение"
        title="Определить местоположение"
        disabled={isLoading}
        onClick={requestLocation}>
        Гео
      </Button>
      {error && <Info>{error}</Info>}
      {coords && !error && (
        <Info>
          {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
        </Info>
      )}
    </div>
  )
}
