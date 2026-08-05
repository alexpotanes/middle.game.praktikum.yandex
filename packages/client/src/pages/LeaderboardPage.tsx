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
import { STATUS } from '../slices/constants'
import {
  Content,
  Description,
  Eyebrow,
  Page,
  Section,
  Title,
} from './LeaderboardPage.styles'

export const LeaderboardPage = () => {
  const dispatch = useDispatch()
  const entries = useSelector(selectLeaderboard)
  const status = useSelector(selectLeaderboardStatus)

  usePage({ initPage: initLeaderboardPage })

  useEffect(() => {
    if (status === STATUS.IDLE) {
      dispatch(fetchLeaderboardThunk())
    }
  }, [dispatch, status])

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
          <LeaderboardTable
            entries={entries}
            isLoading={status === STATUS.LOADING}
          />
        </Section>
      </Content>
    </Page>
  )
}

export const initLeaderboardPage = () => Promise.resolve()
