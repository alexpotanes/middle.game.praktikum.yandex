import { Button } from '../button'
import { Actions } from '../../pages/GamePage.styles'
import { IDLE_TIPS } from './idleTips'
import {
  Intro,
  TipItem,
  TipsHeading,
  TipsList,
  TipText,
  TipTitle,
} from './IdleScreen.styles'

export const IdleScreen = ({ onFind }: { onFind: () => void }) => (
  <>
    <Intro>
      War Chest — это тактическая абстрактная игра с механикой bag-building
      (построение мешка), где игроки выступают в роли средневековых командиров,
      борющихся за контроль над тактическими точками на поле боя.
      <br />
      <br />
      Случайный подбор, партия 1 на 1.
    </Intro>
    <Actions>
      <Button onClick={onFind}>Найти игру</Button>
    </Actions>
    <TipsHeading>Перед стартом</TipsHeading>
    <TipsList>
      {IDLE_TIPS.map(tip => (
        <TipItem key={tip.title}>
          <TipTitle>{tip.title}</TipTitle>
          <TipText>{tip.text}</TipText>
        </TipItem>
      ))}
    </TipsList>
  </>
)
