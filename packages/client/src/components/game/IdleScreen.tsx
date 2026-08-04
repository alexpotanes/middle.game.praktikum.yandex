import { Flourish } from '../Flourish'
import { Actions } from '../../pages/GamePage.styles'
import screenshotBoard from '../../assets/screenshot-board.png'
import {
  AboutCard,
  AboutLabel,
  AboutText,
  Eyebrow,
  Hero,
  HeroButton,
  HeroContent,
  HeroImage,
  HeroScrim,
  HeroTagline,
  HeroTitle,
  TipCard,
  TipIcon,
  TipsGrid,
  TipText,
  TipTitle,
} from './IdleScreen.styles'

const TIPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.7 3.35L12 10.9 5.3 7.55 12 4.2Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: 'Гексагональное поле',
    text: 'Локации с контрольными точками спрятаны на боевой сетке — займите их раньше соперника.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 2 2 7l10 5 10-5-10-5Zm0 8.5L4.2 6.9 12 3.3l7.8 3.6L12 10.5ZM2 12l10 5 10-5v2l-10 5-10-5v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: 'Соберите войско',
    text: 'В начале партии вы набираете отряды с уникальными тактическими способностями.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M6 2v20h2v-8h9l-2.5-4L17 6H8V2H6Z" fill="currentColor" />
      </svg>
    ),
    title: 'Контроль баз',
    text: 'Побеждает тот, кто первым разместит все маркеры контроля на локациях соперника.',
  },
]

export const IdleScreen = ({ onFind }: { onFind: () => void }) => (
  <>
    <Hero>
      <HeroImage
        src={screenshotBoard}
        alt="Игровое поле War Chest"
        loading="lazy"
      />
      <HeroScrim />
      <HeroContent>
        <Eyebrow>Случайный подбор · 1×1</Eyebrow>
        <HeroTitle>Готовы к партии?</HeroTitle>
        <HeroTagline>
          Найдём вам соперника и начнём бой за контрольные точки на
          гексагональном поле.
        </HeroTagline>
        <Actions>
          <HeroButton onClick={onFind}>Найти игру</HeroButton>
        </Actions>
      </HeroContent>
    </Hero>

    <AboutCard>
      <AboutLabel>Об игре</AboutLabel>
      <AboutText>
        War Chest — это тактическая абстрактная игра с механикой bag-building
        (построение мешка), где игроки выступают в роли средневековых
        командиров, борющихся за контроль над тактическими точками на поле боя.
      </AboutText>
    </AboutCard>

    <Flourish />

    <TipsGrid>
      {TIPS.map(tip => (
        <TipCard key={tip.title}>
          <TipIcon>{tip.icon}</TipIcon>
          <TipTitle>{tip.title}</TipTitle>
          <TipText>{tip.text}</TipText>
        </TipCard>
      ))}
    </TipsGrid>
  </>
)
