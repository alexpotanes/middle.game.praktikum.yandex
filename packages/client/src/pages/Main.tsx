import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from '../store'
import { selectUser } from '../slices/userSlice'
import { logoutThunk } from '../thunks/authThunks'
import { SectionTitle } from '../components/SectionTitle'
import { Flourish } from '../components/Flourish'
import { usePage } from '../hooks/usePage'
import {
  ForumIcon,
  GameIcon,
  LeaderboardIcon,
  ProfileIcon,
} from '../shared/icons'
import screenshotGame from '../assets/screenshot-game.png'
import screenshotCloseUp from '../assets/screenshot-close-up.png'
import screenshotBoard from '../assets/screenshot-board.png'
import {
  Description,
  Eyebrow,
  FeatureCard,
  FeatureGrid,
  FeatureText,
  FeatureTitle,
  Greeting,
  Hero,
  HeroActions,
  HeroText,
  NavCard,
  NavCardDescription,
  NavCardIcon,
  NavCardTitle,
  NavGrid,
  Page,
  PrimaryButton,
  ScreenshotFigure,
  ScreenshotImage,
  ScreenshotsGrid,
  SecondaryAction,
  SecondaryButton,
  Section,
  Title,
} from './Main.styles'
import { Header } from '../components/Header'

const screenshots = [
  {
    src: screenshotGame,
    alt: 'Партия War Chest Online: игровое поле и панели игроков',
  },
  {
    src: screenshotCloseUp,
    alt: 'Крупный план отрядов на игровой доске',
  },
  {
    src: screenshotBoard,
    alt: 'Состояние партии на двоих на гексагональной доске',
  },
]

type NavCardItem = {
  to: string
  title: string
  description: string
  icon: JSX.Element
}

const navCards: NavCardItem[] = [
  {
    to: '/game',
    title: 'Играть',
    description: 'Найдите соперника и начните партию на игровой доске',
    icon: <GameIcon />,
  },
  {
    to: '/forum',
    title: 'Форум',
    description: 'Обсудите стратегии и делитесь опытом с другими игроками',
    icon: <ForumIcon />,
  },
  {
    to: '/leaderboard',
    title: 'Лидерборд',
    description: 'Следите за рейтингом лучших полководцев',
    icon: <LeaderboardIcon />,
  },
  {
    to: '/profile',
    title: 'Профиль',
    description: 'Управляйте своим аккаунтом и историей сыгранных партий',
    icon: <ProfileIcon />,
  },
]

export const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUser)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate('/')
  }

  usePage({ initPage: initMainPage })

  const displayName = user?.display_name || user?.first_name

  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная — War Chest Online</title>
        <meta
          name="description"
          content="War Chest Online — фанатская онлайн-адаптация настольной стратегии War Chest. Играйте, обсуждайте партии на форуме и соревнуйтесь в лидерборде."
        />
      </Helmet>
      <Header />

      <main>
        <Hero>
          <HeroText>
            <Eyebrow>Абстрактная военная стратегия онлайн</Eyebrow>
            <Title>War Chest</Title>
            <Greeting>
              {displayName
                ? `С возвращением, ${displayName}!`
                : 'Соберите войско, займите базы соперника и станьте лучшим полководцем.'}
            </Greeting>
            <Description>
              War Chest — это настольная стратегия для двух или четырёх игроков,
              в которой соперники сражаются за контроль над базами на игровом
              поле, используя отряды с уникальными способностями.
            </Description>
            <HeroActions>
              <PrimaryButton to="/game">Начать игру</PrimaryButton>
              <SecondaryButton to="/rules">Как играть</SecondaryButton>
              {user && (
                <SecondaryAction type="button" onClick={handleLogout}>
                  Выйти
                </SecondaryAction>
              )}
            </HeroActions>
          </HeroText>
        </Hero>

        <Flourish />

        <Section>
          <SectionTitle
            eyebrow="Быстрый переход"
            title="Всё, что нужно для игры"
            subtitle="Игра, сообщество и статистика - в двух шагах от главной страницы"
          />
          <NavGrid>
            {navCards.map(({ to, title, description, icon }) => (
              <NavCard key={to} to={to}>
                <NavCardIcon>{icon}</NavCardIcon>
                <NavCardTitle>{title}</NavCardTitle>
                <NavCardDescription>{description}</NavCardDescription>
              </NavCard>
            ))}
          </NavGrid>
        </Section>

        <Flourish />

        <Section>
          <SectionTitle
            eyebrow="Скриншоты"
            title="Как выглядит игра"
            subtitle="Игровое поле, отряды и партии на двоих"
          />
          <ScreenshotsGrid>
            {screenshots.map(({ src, alt }) => (
              <ScreenshotFigure key={alt}>
                <ScreenshotImage src={src} alt={alt} loading="lazy" />
              </ScreenshotFigure>
            ))}
          </ScreenshotsGrid>
        </Section>

        <Flourish />

        <Section>
          <SectionTitle
            eyebrow="Об игре"
            title="Три отряда, одна победа"
            subtitle="Соберите войско из уникальных отрядов и заберите базы соперника раньше, чем он заберёт ваши"
          />
          <FeatureGrid>
            <FeatureCard>
              <FeatureTitle>Уникальные отряды</FeatureTitle>
              <FeatureText>
                Каждая партия начинается с выбора войска - комбинации отрядов с
                особыми способностями, от которой зависит ваша стратегия.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Контроль базы</FeatureTitle>
              <FeatureText>
                Захватывайте базы соперника и удерживайте свои - тот, кто первым
                потеряет все базы, проигрывает партию.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Дуэль один на один</FeatureTitle>
              <FeatureText>
                Случайный подбор соперника и короткая партия - побеждает тот,
                кто первым разместит все маркеры контроля.
              </FeatureText>
            </FeatureCard>
          </FeatureGrid>
        </Section>
      </main>
    </Page>
  )
}

export const initMainPage = () => Promise.resolve()
