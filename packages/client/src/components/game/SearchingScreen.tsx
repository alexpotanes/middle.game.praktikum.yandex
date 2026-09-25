import { GameIcon } from '../../shared/icons'
import {
  CancelAction,
  Hero,
  Radar,
  RadarCore,
  RadarRing,
  SearchingHint,
  SearchingTitle,
} from './SearchingScreen.styles'

export const SearchingScreen = ({ onCancel }: { onCancel: () => void }) => (
  <Hero>
    <Radar>
      <RadarRing $delay={0} />
      <RadarRing $delay={0.7} />
      <RadarRing $delay={1.4} />
      <RadarCore>
        <GameIcon width={26} height={26} />
      </RadarCore>
    </Radar>
    <SearchingTitle>Ищем соперника…</SearchingTitle>
    <SearchingHint>
      Матч начнётся автоматически, как только найдётся соперник для партии 1×1.
    </SearchingHint>
    <CancelAction onClick={onCancel}>Отмена</CancelAction>
  </Hero>
)
