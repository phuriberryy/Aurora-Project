import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './features/ui/uiSlice';

// import searchReducer from './features/search/searchSlice';
// import flightsReducer from './features/flights/flightsSlice';
import bookingReducer from './component/booking/bookingSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    // search: searchReducer,
    // flights: flightsReducer,
    booking: bookingReducer,
  },
});




