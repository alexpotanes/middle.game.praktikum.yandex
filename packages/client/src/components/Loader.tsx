import styled from 'styled-components'

import { colors } from '../styles/theme'

export const Loader = () => (
  <Wrapper>
    <Spinner />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(86, 72, 68, 0.2);
  border-top-color: ${colors.gold};
  border-radius: 50%;
  animation: wc-spin 0.8s linear infinite;

  @keyframes wc-spin {
    to {
      transform: rotate(360deg);
    }
  }
`
