import { Link } from 'react-router-dom'
import { styled } from 'styled-components'
import { Helmet } from 'react-helmet'

import { useSelector } from '../store'
import { fetchUserThunk, selectUser } from '../slices/userSlice'
import { Header } from '../components/Header'
import { SectionTitle } from '../components/SectionTitle'
import { Flourish } from '../components/Flourish'
import { usePage } from '../hooks/usePage'
import { colors, shadows } from '../styles/theme'
import type { PageInitArgs } from '../router'
import {
  ForumIcon,
  GameIcon,
  LeaderboardIcon,
  ProfileIcon,
} from '../shared/icons'
import screenshotGame from '../assets/screenshot-game.png'
import screenshotCloseUp from '../assets/screenshot-close-up.png'
import screenshotBoard from '../assets/screenshot-board.png'

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
  const user = useSelector(selectUser)

  usePage({ initPage: initMainPage })

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
              {user
                ? `С возвращением, ${user.name}!`
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
              <FeatureTitle>Игра на двоих и четверых</FeatureTitle>
              <FeatureText>
                Собирайте команду или сражайтесь один на один - правила War
                Chest поддерживают оба формата.
              </FeatureText>
            </FeatureCard>
          </FeatureGrid>
        </Section>
      </main>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100vh;
`

const Hero = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 56px 24px 40px;
`

const HeroText = styled.div`
  max-width: 720px;
`

const Eyebrow = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.heading};
`

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
  color: ${colors.heading};
`

const Greeting = styled.p`
  margin: 0 0 16px;
  font-size: 18px;
  color: ${colors.text};
`

const Description = styled.p`
  margin: 0 0 28px;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.text};
`

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

const PrimaryButton = styled(Link)`
  ${buttonBase}
  background: ${colors.header};
  color: ${colors.onHeader};
  border: 1px solid ${colors.header};
  box-shadow: ${shadows.card};
`

const SecondaryButton = styled(Link)`
  ${buttonBase}
  background: transparent;
  color: ${colors.heading};
  border: 1px solid ${colors.header};
`

const Section = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px;
`

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`

const NavCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(86, 72, 68, 0.15);
  color: ${colors.heading};
  text-decoration: none;
  box-shadow: ${shadows.card};
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${colors.header};
    transform: translateY(-3px);
  }
`

const NavCardIcon = styled.span`
  color: ${colors.heading};
`

const NavCardTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.heading};
`

const NavCardDescription = styled.span`
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.text};
`

const ScreenshotsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ScreenshotFigure = styled.figure`
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(86, 72, 68, 0.15);
  box-shadow: ${shadows.card};
`

const ScreenshotImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: center;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`

const FeatureCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(86, 72, 68, 0.12);
`

const FeatureTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  color: ${colors.heading};
`

const FeatureText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: ${colors.text};
`

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
