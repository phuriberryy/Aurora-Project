Aurora Project – React Flight Booking 
=========================================
Member
--------
-672110140 ณัฐรินทร์ อาณัติธนันท์กุล 
-672110137 กันตพงษ์ กันหามิ่ง 
-672110234 ปิยาพัชร ใหม่อารินทร  
-672110239 ภูริชญา หลำสวัสดิ์


Overview
--------
Aurora Project is a single-page flight booking demo built with React. It showcases a complete user journey from searching flights, sorting results, picking seats, and completing a booking, while also covering authentication and reusable UI patterns. The app uses Redux Toolkit for state management, styled-components for theming, and a public MockAPI backend for flight and user data.

Key Features
------------
- Flight search with one-way/return toggle, validation, and dynamic airport options.
- Results page with client-side sorting (price, departure, arrival, duration).
- Booking workflow backed by Redux: passenger forms, contact info, extras, multi-seat picker, summary, and confirmation.
- Authentication flow (signup/login) with toast notifications and mock API integration.
- Persistent booking summary page that reads from the Redux store.
- Global layout with navbar, modal, and toast system wired to the UI slice.
- UI kit showcase page demonstrating shared Button/Input components and theme usage.

Tech Stack
----------
- React 18 with React Router v6 (`createBrowserRouter`, `RouterProvider`).
- Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`, `useSelector`, `useDispatch`).
- styled-components (`ThemeProvider`, `createGlobalStyle`) for design system and layout.
- Axios instance wrapper for REST communication with MockAPI.
- PropTypes for component prop validation.

Project Structure (selected)
----------------------------
```
src/
  component/
    search/          – SearchBar and related UI controls
    flights/         – Flight cards, list, sort select
    booking/         – Booking wizard, Redux slice, seat picker
    ui/              – Shared UI primitives (Button, Input, Layout, Navbar, Modal, Toast)
  features/          – Redux slices (ui)
  pages/             – Top-level routes (Home, Flights, Booking, Login, Signup, MyBookings, NotFound, UIKit)
  services/          – API and HTTP helpers
  index.js           – App bootstrap with providers
  routes.jsx         – Router definition
  theme.js           – Theme tokens
  GlobalStyle.js     – Global CSS baseline
```

Getting Started
---------------
1. **Install dependencies**
   ```
   npm install
   ```
2. **Run the development server**
   ```
   npm start
   ```
   The app runs on <http://localhost:3000> by default with hot reload enabled.
3. **Build for production**
   ```
   npm run build
   ```
4. **Lint the project** (if configured in package.json)
   ```
   npm run lint
   ```

API Configuration
-----------------
The axios client at `src/services/http.js` targets `https://6900a4f3ff8d792314bacf9b.mockapi.io/api/v1`. Environment variables (`REACT_APP_*`) may be added to `.env` for advanced booking endpoints (see `bookingSlice.js` for supported keys).

Testing Notes
-------------
- Client-side validation is present in SearchBar and BookingForm to prevent invalid submissions.
- Redux booking slice includes async thunk `submitBooking` that simulates seat reservation and handles network errors gracefully.
- MyBookingsPage reads booking confirmation straight from the Redux store so state persists across route changes during a session.

Future Improvements
-------------------
- Implement real flight detail page (`/flights/:id`).
- Add persistent authentication/session management.
- Expand automated tests (unit/e2e) for forms and Redux flows.
