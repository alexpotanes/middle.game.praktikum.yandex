import { useCallback, useState } from 'react'

export type NotificationPermissionState = 'default' | 'granted' | 'denied'

type NotificationState = {
  permission: NotificationPermissionState
  error: string | null
  isLoading: boolean
}

type NotificationControls = NotificationState & {
  requestPermission: () => Promise<NotificationPermissionState>
  showNotification: (title: string, options?: NotificationOptions) => void
}

const isSupported = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window

const getPermission = (): NotificationPermissionState => {
  if (!isSupported()) {
    return 'denied'
  }
  return Notification.permission
}

export const useNotification = (): NotificationControls => {
  const [state, setState] = useState<NotificationState>({
    permission: getPermission(),
    error: null,
    isLoading: false,
  })

  const requestPermission =
    useCallback(async (): Promise<NotificationPermissionState> => {
      if (!isSupported()) {
        setState({
          permission: 'denied',
          error: 'Уведомления не поддерживаются браузером',
          isLoading: false,
        })
        return 'denied'
      }

      setState(prev => ({ ...prev, error: null, isLoading: true }))

      try {
        const permission = await Notification.requestPermission()
        setState({
          permission,
          error: null,
          isLoading: false,
        })
        return permission
      } catch (e) {
        setState({
          permission: Notification.permission,
          error: 'Не удалось запросить разрешение на уведомления',
          isLoading: false,
        })
        return Notification.permission
      }
    }, [])

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported()) {
        setState(prev => ({
          ...prev,
          error: 'Уведомления не поддерживаются браузером',
        }))
        return
      }

      if (Notification.permission !== 'granted') {
        setState(prev => ({
          ...prev,
          error: 'Нет разрешения на показ уведомлений',
        }))
        return
      }

      try {
        new Notification(title, options)
        setState(prev => ({ ...prev, error: null }))
      } catch (e) {
        setState(prev => ({
          ...prev,
          error: 'Не удалось показать уведомление',
        }))
      }
    },
    []
  )

  return {
    ...state,
    requestPermission,
    showNotification,
  }
}
