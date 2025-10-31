import { createBrowserRouter } from 'react-router-dom';


import Layout from './component/ui/Layout'; 


import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingPage from './component/booking/BookingPage';
import NotFound from './pages/NotFound';
import MyBookingsPage from './pages/MyBookingsPage'; 

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UIKitPage from './pages/UIKitPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        index: true, 
        element: <LoginPage />,
      },
      {
        path: 'home',
        element: <HomePage />
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
        element: <MyBookingsPage />,
        // element: <MyBookingsPage />,
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
    path: '*',
    element: <NotFound />, 
  },
]);






