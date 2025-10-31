import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Redux
import { Provider } from 'react-redux';
import { store } from './store';

// 2. Styled-components
import { ThemeProvider } from 'styled-components';
import { theme } from './theme'; 
import { GlobalStyle } from './GlobalStyle'; 

// 3. React Router
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 1. เชื่อม Redux Store ให้แอป */}
    <Provider store={store}>
      {/* 2. เชื่อม Theme และ Global Style */}
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* 3. เชื่อม Router (ให้ RouterProvider แสดงผล) */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

