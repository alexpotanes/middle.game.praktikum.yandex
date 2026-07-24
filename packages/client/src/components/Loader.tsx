import styled from 'styled-components'

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
  border: 4px solid var(--wc-border);
  border-top-color: var(--wc-gold);
  border-radius: 50%;
  animation: wc-spin 0.8s linear infinite;

  @keyframes wc-spin {
    to {
      transform: rotate(360deg);
    }
  }
`
