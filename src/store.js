import { configureStore } from '@reduxjs/toolkit';

// 1. Import reducer ของคุณ (D)
import uiReducer from './features/ui/uiSlice';

// 2. Import reducers อื่นๆ ที่นี่ (ของ A, B, C)
// (เราจะมาเพิ่มทีหลังตอนเพื่อนๆ ทำเสร็จ)
// import searchReducer from './features/search/searchSlice';
// import flightsReducer from './features/flights/flightsSlice';
import bookingReducer from './features/booking/bookingSlice';

export const store = configureStore({
  reducer: {
    // 3. รวม reducer ทั้งหมด
    ui: uiReducer,
    // search: searchReducer,
    // flights: flightsReducer,
    booking: bookingReducer,
  },
});


