import { Button } from '../button'
import { Actions, StatusText } from '../../pages/GamePage.styles'

export const SearchingScreen = ({ onCancel }: { onCancel: () => void }) => (
  <>
    <StatusText>Ищем соперника…</StatusText>
    <Actions>
      <Button onClick={onCancel}>Отмена</Button>
    </Actions>
  </>
)
