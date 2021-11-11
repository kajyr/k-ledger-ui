import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
    font-family: "Source Sans Pro", sans-serif;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  body {
      background: #ecf0f5;  
  }

  * {
    box-sizing: border-box;
  }

  a,
  a:visited,
  a:hover {
    color: #3c8dbc;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  p {
    white-space: break-spaces;
  }
`;

export default GlobalStyle;
