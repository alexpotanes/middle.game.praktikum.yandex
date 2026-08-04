import { Button } from '../button'
import { Actions, StatusText } from '../../pages/GamePage.styles'

export const IdleScreen = ({ onFind }: { onFind: () => void }) => (
  <>
    <StatusText>Случайный подбор соперника, партия 1 на 1.</StatusText>
    <Actions>
      <Button onClick={onFind}>Найти игру</Button>
    </Actions>
  </>
)
