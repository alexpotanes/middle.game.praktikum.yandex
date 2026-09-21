import styled from 'styled-components'

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
  background: transparent;
  border: 1px solid #bf4f74;
  border-radius: 4px;
  color: #bf4f74;
  cursor: pointer;

  &:hover {
    background: papayawhip;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Info = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: #333;
`
