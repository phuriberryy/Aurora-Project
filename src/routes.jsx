import { createBrowserRouter } from 'react-router-dom';

// 1. Import กรอบเว็บ (Layout) จาก path ที่ถูกต้อง
import Layout from './component/ui/Layout'; 

// 2. Import หน้าต่างๆ ที่เราสร้างไว้ (หรือกำลังจะสร้าง)
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingPage from './pages/BookingPage';
import NotFound from './pages/NotFound'; 

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UIKitPage from './pages/UIKitPage';

// 3. สร้าง "แผนที่เว็บ"
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // ให้ Layout เป็น "กรอบ" ของทุกหน้า
    children: [
      {
        index: true, // index: true หมายถึง path: '/'
        element: <HomePage />,
      },
      {
        path: 'flights',
        element: <FlightsPage />,
      },
      {
        path: 'flights/:id', // :id คือการรับ parameter (B)
        element: <FlightDetailPage />,
      },
      {
        path: 'booking/:id', // :id คือการรับ parameter (C)
        element: <BookingPage />,
      },
      {
      path: 'my-bookings',
        element: <NotFound />, // (ชี้ไปที่ NotFound ก่อนชั่วคราว)
        // element: <MyBookingsPage />, // (ถ้ามีหน้าจริงแล้ว)
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'test_ui',
        element: <UIKitPage />,
      },
    ],
  },
  {
    path: '*', // '*' คือหน้าที่ไม่ตรงกับอันอื่นเลย
    element: <NotFound />, // แสดงหน้า 404
  },
]);

