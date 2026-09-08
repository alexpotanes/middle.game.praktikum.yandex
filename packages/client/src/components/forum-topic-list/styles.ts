import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Card = styled(Link)`
  display: block;
  padding: 20px 24px;
  border: 1px solid rgba(86, 72, 68, 0.16);
  border-radius: 8px;
  background: #fff;
  box-shadow: ${shadows.card};
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
  }
`

export const CardHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`

export const Title = styled.h2`
  margin: 0;
  color: ${colors.header};
  font-size: 20px;
  line-height: 1.3;
`

export const Excerpt = styled.p`
  margin: 8px 0 0;
  overflow: hidden;
  color: ${colors.text};
  font-size: 15px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Meta = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  color: rgba(27, 27, 27, 0.6);
  font-size: 13px;
`

export const Empty = styled.p`
  margin: 0;
  padding: 24px;
  border: 1px dashed rgba(86, 72, 68, 0.3);
  border-radius: 8px;
  color: rgba(27, 27, 27, 0.7);
  font-size: 15px;
  text-align: center;
`
