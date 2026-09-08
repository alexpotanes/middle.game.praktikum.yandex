import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const BackLink = styled(Link)`
  align-self: flex-start;
  color: ${colors.header};
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const Topic = styled.article`
  padding: 24px;
  border: 1px solid rgba(86, 72, 68, 0.16);
  border-radius: 8px;
  background: #fff;
  box-shadow: ${shadows.card};
`

export const Title = styled.h1`
  margin: 0;
  color: ${colors.header};
  font-size: clamp(24px, 3.5vw, 30px);
`

export const Meta = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  color: rgba(27, 27, 27, 0.6);
  font-size: 13px;
`

export const Message = styled.p`
  margin: 16px 0 0;
  color: ${colors.text};
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`

export const Comments = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const CommentsTitle = styled.h2`
  margin: 0;
  color: ${colors.header};
  font-size: 20px;
`

export const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Comment = styled.li`
  padding: 16px 20px;
  border: 1px solid rgba(86, 72, 68, 0.16);
  border-radius: 8px;
  background: #fff;
`

export const CommentMeta = styled.div`
  display: flex;
  gap: 12px;
  color: rgba(27, 27, 27, 0.6);
  font-size: 12px;
`

export const CommentAuthor = styled.span`
  color: ${colors.header};
  font-weight: 700;
`

export const CommentMessage = styled.p`
  margin: 6px 0 0;
  color: ${colors.text};
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
`

export const Replies = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0 0;
  padding: 12px 0 0 20px;
  border-top: 1px dashed rgba(86, 72, 68, 0.16);
  border-left: 2px solid rgba(86, 72, 68, 0.16);
  list-style: none;
`

export const Empty = styled.p`
  margin: 0;
  padding: 20px;
  border: 1px dashed rgba(86, 72, 68, 0.3);
  border-radius: 8px;
  color: rgba(27, 27, 27, 0.7);
  font-size: 15px;
  text-align: center;
`

export const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
`
