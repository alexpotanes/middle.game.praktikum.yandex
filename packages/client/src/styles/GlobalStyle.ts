import { createGlobalStyle } from 'styled-components'

import { colors } from './theme'

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background: ${colors.bg};
    color: ${colors.text};
    font-family: 'Georgia', 'Times New Roman', serif;
  }
`
