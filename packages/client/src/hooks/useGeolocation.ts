import { useCallback, useEffect, useRef, useState } from 'react'

export type GeolocationCoords = {
  latitude: number
  longitude: number
  accuracy: number
}

type GeolocationState = {
  coords: GeolocationCoords | null
  error: string | null
  isLoading: boolean
}

type GeolocationControls = GeolocationState & {
  requestLocation: () => void
  watchLocation: () => void
  stopWatching: () => void
}

const toCoords = (position: GeolocationPosition): GeolocationCoords => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
})

const toErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Доступ к геолокации запрещён'
    case error.POSITION_UNAVAILABLE:
      return 'Не удалось определить местоположение'
    case error.TIMEOUT:
      return 'Время ожидания истекло'
    default:
      return 'Неизвестная ошибка геолокации'
  }
}

export const useGeolocation = (): GeolocationControls => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    isLoading: false,
  })

  const watchIdRef = useRef<number | null>(null)

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coords: toCoords(position),
      error: null,
      isLoading: false,
    })
  }, [])

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      error: toErrorMessage(error),
      isLoading: false,
    }))
  }, [])

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({
        coords: null,
        error: 'Геолокация не поддерживается браузером',
        isLoading: false,
      })
      return
    }

    setState(prev => ({ ...prev, error: null, isLoading: true }))
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [handleSuccess, handleError])

  const watchLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({
        coords: null,
        error: 'Геолокация не поддерживается браузером',
        isLoading: false,
      })
      return
    }

    if (watchIdRef.current !== null) {
      return
    }

    setState(prev => ({ ...prev, error: null, isLoading: true }))
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError
    )
  }, [handleSuccess, handleError])

  const stopWatching = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== 'undefined' &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopWatching()
    }
  }, [stopWatching])

  return {
    ...state,
    requestLocation,
    watchLocation,
    stopWatching,
  }
}
