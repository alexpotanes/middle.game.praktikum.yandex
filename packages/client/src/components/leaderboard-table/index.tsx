import {
  Avatar,
  Cell,
  GamesCount,
  HeaderCell,
  PlayerInfo,
  PlayerName,
  Rank,
  RankBadge,
  Rating,
  Table,
  WinRate,
  Wrapper,
} from './styles'

type LeaderboardEntry = {
  id: number
  rank: number
  playerName: string
  avatar: string | null
  wins: number
  losses: number
  totalGames: number
  winRate: number
  rating: number
}

type LeaderboardTableProps = {
  entries: LeaderboardEntry[]
  isLoading?: boolean
}

export const LeaderboardTable = ({
  entries,
  isLoading = false,
}: LeaderboardTableProps) => {
  if (isLoading) {
    return <Wrapper>Загрузка...</Wrapper>
  }

  if (entries.length === 0) {
    return <Wrapper>Нет данных для отображения</Wrapper>
  }

  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <HeaderCell>Место</HeaderCell>
            <HeaderCell>Игрок</HeaderCell>
            <HeaderCell align="center">Рейтинг</HeaderCell>
            <HeaderCell align="center">Игр</HeaderCell>
            <HeaderCell align="center">Побед</HeaderCell>
            <HeaderCell align="center">% побед</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <Cell>
                <Rank>
                  {entry.rank <= 3 ? (
                    <RankBadge rank={entry.rank}>{entry.rank}</RankBadge>
                  ) : (
                    entry.rank
                  )}
                </Rank>
              </Cell>
              <Cell>
                <PlayerInfo>
                  <Avatar>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.playerName} />
                    ) : (
                      <span>{entry.playerName[0]}</span>
                    )}
                  </Avatar>
                  <PlayerName>{entry.playerName}</PlayerName>
                </PlayerInfo>
              </Cell>
              <Cell align="center">
                <Rating>{entry.rating}</Rating>
              </Cell>
              <Cell align="center">
                <GamesCount>{entry.totalGames}</GamesCount>
              </Cell>
              <Cell align="center">{entry.wins}</Cell>
              <Cell align="center">
                <WinRate>{entry.winRate.toFixed(1)}%</WinRate>
              </Cell>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  )
}
