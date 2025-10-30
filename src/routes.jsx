import { createBrowserRouter } from 'react-router-dom';

// 1. Import à¸à¸£à¸­à¸šà¹€à¸§à¹‡à¸š (Layout) à¸ˆà¸²à¸ path à¸—à¸µà¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡
import Layout from './component/ui/Layout'; 

// 2. Import à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡à¹† à¸—à¸µà¹ˆà¹€à¸£à¸²à¸ªà¸£à¹‰à¸²à¸‡à¹„à¸§à¹‰ (à¸«à¸£à¸·à¸­à¸à¸³à¸¥à¸±à¸‡à¸ˆà¸°à¸ªà¸£à¹‰à¸²à¸‡)
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingPage from './component/booking/BookingPage';
import NotFound from './pages/NotFound';
import MyBookingsPage from './pages/MyBookingsPage'; 

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UIKitPage from './pages/UIKitPage';

// 3. à¸ªà¸£à¹‰à¸²à¸‡ "à¹à¸œà¸™à¸—à¸µà¹ˆà¹€à¸§à¹‡à¸š"
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // à¹ƒà¸«à¹‰ Layout à¹€à¸›à¹‡à¸™ "à¸à¸£à¸­à¸š" à¸‚à¸­à¸‡à¸—à¸¸à¸à¸«à¸™à¹‰à¸²
    children: [
      {
        index: true, // index: true à¸«à¸¡à¸²à¸¢à¸–à¸¶à¸‡ path: '/'
        element: <HomePage />,
      },
      {
        path: 'flights',
        element: <FlightsPage />,
      },
      {
        path: 'flights/:id', // :id parameter (B)
        element: <FlightDetailPage />,
      },
      {
        path: 'booking',
        element: <BookingPage />,
      },
      {
        path: 'booking/:id', // :id à¸„à¸·à¸­à¸à¸²à¸£à¸£à¸±à¸š parameter (C)
        element: <BookingPage />,
      },
      {
      path: 'my-bookings',
        element: <MyBookingsPage />, // (à¸Šà¸µà¹‰à¹„à¸›à¸—à¸µà¹ˆ NotFound à¸à¹ˆà¸­à¸™à¸Šà¸±à¹ˆà¸§à¸„à¸£à¸²à¸§)
        // element: <MyBookingsPage />, // (à¸–à¹‰à¸²à¸¡à¸µà¸«à¸™à¹‰à¸²à¸ˆà¸£à¸´à¸‡à¹à¸¥à¹‰à¸§)
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
    path: '*', // '*' à¸„à¸·à¸­à¸«à¸™à¹‰à¸²à¸—à¸µà¹ˆà¹„à¸¡à¹ˆà¸•à¸£à¸‡à¸à¸±à¸šà¸­à¸±à¸™à¸­à¸·à¹ˆà¸™à¹€à¸¥à¸¢
    element: <NotFound />, // à¹à¸ªà¸”à¸‡à¸«à¸™à¹‰à¸² 404
  },
]);






