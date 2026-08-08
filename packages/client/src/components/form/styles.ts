import { styled } from 'styled-components'

import { colors, shadows } from '../../styles/theme'

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid rgba(86, 72, 68, 0.16);
  box-shadow: ${shadows.card};
`

export const PanelTitle = styled.h2`
  margin: 0 0 20px;
  color: ${colors.header};
  font-size: 22px;
  line-height: 1.2;
`

export const StyledForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const Footer = styled.div`
  display: grid;
  gap: 18px;
  margin-top: auto;
  padding-top: 18px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: center;

  > button {
    width: 100%;
  }
`

export const FormNoticeWrap = styled.div`
  margin-top: -4px;
`
