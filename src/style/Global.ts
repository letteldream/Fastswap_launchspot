import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    //background-color: ${({ theme }) => theme.colors.background};
    // background-color: #263126;
    background-color: #192219;

    img {
      height: auto;
      max-width: 100%;
    }

    #root {
      background: rgb(38, 49, 38); 
      // background-size: cover;
      background-size: 100% auto;
    }
  }
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary}; 
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px ${({ theme }) => theme.colors.primary}; 
    border-radius: 10px;
  }
`

export default GlobalStyle
