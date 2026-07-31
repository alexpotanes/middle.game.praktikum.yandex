import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const CreateLink = styled(Link)`
  padding: 8px 16px;
  border-radius: 4px;
  background: #bf4f74;
  color: #fff;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }
`

export const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  color: #bf4f74;
`

export const TopicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const TopicItem = styled.li`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
`

export const TopicTitleLink = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: #bf4f74;
  }
`

export const TopicMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  color: #666;
  font-size: 14px;
`

export const TopicHeader = styled.div`
  margin-bottom: 8px;
`

export const TopicBody = styled.p`
  white-space: pre-wrap;
`

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const CommentItem = styled.li`
  border-left: 3px solid #bf4f74;
  background: #fafafa;
  padding: 8px 12px;
`

export const CommentAuthor = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`

export const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
`

export const Textarea = styled.textarea`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  resize: vertical;
`

export const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #bf4f74;
  color: #fff;
  cursor: pointer;
  font: inherit;

  &:hover {
    opacity: 0.9;
  }
`

export const ErrorText = styled.p`
  color: #d33;
  margin: 0;
`
