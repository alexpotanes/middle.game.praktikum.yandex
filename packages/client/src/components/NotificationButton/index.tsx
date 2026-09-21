import { FC } from 'react'

import { useNotification } from '../../hooks/useNotification'
import { Button, Info } from './styles'

export const NotificationButton: FC = () => {
  const { permission, error, isLoading, requestPermission, showNotification } =
    useNotification()

  const handleClick = async () => {
    if (permission !== 'granted') {
      const next = await requestPermission()
      if (next !== 'granted') {
        return
      }
    }

    showNotification('Практикум', {
      body: 'Уведомления включены 🎉',
    })
  }

  return (
    <div>
      <Button
        type="button"
        aria-label="Включить уведомления"
        title="Включить уведомления"
        disabled={isLoading || permission === 'denied'}
        onClick={() => {
          void handleClick()
        }}>
        Noti
      </Button>
      {error && <Info>{error}</Info>}
    </div>
  )
}
