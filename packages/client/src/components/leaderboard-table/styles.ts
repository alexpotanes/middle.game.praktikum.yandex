import { styled } from 'styled-components'
import { colors, shadows } from '../../styles/theme'

export const Wrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: ${shadows.card};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;

  tbody tr {
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(201, 162, 76, 0.05);
    }
  }
`

type CellAlign = 'left' | 'center' | 'right'

export const HeaderCell = styled.th<{ align?: CellAlign }>`
  padding: 16px 20px;
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${colors.heading};
  border-bottom: 2px solid rgba(86, 72, 68, 0.1);
  background: rgba(245, 242, 239, 0.5);
`

export const Cell = styled.td<{ align?: CellAlign }>`
  padding: 16px 20px;
  text-align: ${props => props.align || 'left'};
  border-bottom: 1px solid rgba(86, 72, 68, 0.05);
  color: ${colors.text};
`

export const Rank = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: ${colors.heading};
  font-size: 16px;
`
export const RankBadge = styled.div<{ rank: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 14px;
  background: ${props => {
    if (props.rank === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)'
    if (props.rank === 2) return 'linear-gradient(135deg, #c0c0c0, #e8e8e8)'
    if (props.rank === 3) return 'linear-gradient(135deg, #cd7f32, #e8a87c)'
    return colors.bg
  }};
  color: ${props => (props.rank <= 3 ? '#1b1b1b' : colors.text)};
  box-shadow: ${props =>
    props.rank <= 3 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
`

export const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.goldLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: ${colors.heading};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 18px;
  }
`

export const PlayerName = styled.div`
  font-weight: 500;
  color: ${colors.heading};
`
export const Rating = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${colors.gold};
`

export const GamesCount = styled.div`
  font-weight: 500;
  color: ${colors.text};
`

export const WinRate = styled.div`
  font-weight: 600;
  color: ${colors.heading};
`
