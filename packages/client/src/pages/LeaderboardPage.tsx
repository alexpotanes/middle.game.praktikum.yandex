import { Helmet } from 'react-helmet'
import { useEffect } from 'react'

import { Header } from '../components/Header'
import { LeaderboardTable } from '../components/leaderboard-table'
import { SectionTitle } from '../components/SectionTitle'
import { usePage } from '../hooks/usePage'
import { useDispatch, useSelector } from '../store'
import {
  selectLeaderboard,
  selectLeaderboardStatus,
} from '../slices/leaderboardSlice'
import { fetchLeaderboardThunk } from '../thunks/leaderboardThunks'
import {
  Content,
  Description,
  Eyebrow,
  Page,
  Section,
  Title,
  RefreshButton,
} from './LeaderboardPage.styles'

export const LeaderboardPage = () => {
  const dispatch = useDispatch()
  const entries = useSelector(selectLeaderboard)
  const status = useSelector(selectLeaderboardStatus)

  usePage({ initPage: initLeaderboardPage })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaderboardThunk())
    }
  }, [dispatch, status])

  const handleRefresh = () => {
    dispatch(fetchLeaderboardThunk())
  }

  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд — War Chest Online</title>
        <meta
          name="description"
          content="Рейтинг лучших игроков War Chest Online. Следите за топом полководцев и соревнуйтесь за первое место"
        />
      </Helmet>

      <Header />

      <Content>
        <Section>
          <Eyebrow>Рейтинг игроков</Eyebrow>
          <Title>Лидерборд</Title>
          <Description>
            Топ лучших полководцев War Chest Online. Соревнуйтесь с другими
            игроками и поднимайтесь в рейтинге, побеждая в партиях.
          </Description>
        </Section>

        <Section>
          <SectionTitle
            eyebrow="Топ 100"
            title="Лучшие игроки"
            subtitle="Рейтинг обновляется после каждой сыгранной партии"
          />

          {/* ← КНОПКА ОБНОВЛЕНИЯ */}
          <RefreshButton
            onClick={handleRefresh}
            disabled={status === 'loading'}>
            {status === 'loading' ? 'Обновление...' : 'Обновить'}
          </RefreshButton>

          <LeaderboardTable
            entries={entries}
            isLoading={status === 'loading'}
          />
        </Section>
      </Content>
    </Page>
  )
}

export const initLeaderboardPage = () => Promise.resolve()
