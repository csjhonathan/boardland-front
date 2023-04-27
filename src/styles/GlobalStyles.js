import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *{
    box-sizing: border-box;
    font-family: 'Farro', sans-serif;
  }
  ::-webkit-scrollbar{
    display: none;
  }
  
`;

export default GlobalStyles;

