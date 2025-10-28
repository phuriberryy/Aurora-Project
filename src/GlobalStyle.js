import { createGlobalStyle } from 'styled-components';
//import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  ${({ theme }) => `
    body {
      margin: 0;
      padding: 0;
      font-family: ${theme.fonts.main};
      background-color: ${theme.colors.light};
      color: ${theme.colors.dark};
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }
  `}
`;

