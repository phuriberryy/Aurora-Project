import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Redux
import { Provider } from 'react-redux';
import { store } from './store'; // (ไฟล์ที่สร้างใน Step 3)

// 2. Styled-components
import { ThemeProvider } from 'styled-components';
import { theme } from './theme'; // (ไฟล์ที่สร้างใน Step 4)
import { GlobalStyle } from './GlobalStyle'; // (ไฟล์ที่สร้างใน Step 4)

// 3. React Router
import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // (ไฟล์ที่คุณเพิ่งสร้างใน Step 6)

// (เราลบ import './index.css' และ './App.js' ออกไปแล้ว)

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

