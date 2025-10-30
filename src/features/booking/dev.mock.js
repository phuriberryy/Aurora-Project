// Helpers for local dev/testing the booking flow without the rest of the app
// Usage: import { demoStartBooking } from './dev.mock' and call it once in a dev-only place.
import { startBooking } from './bookingSlice';

export const demoStartBooking = (dispatch) => {
  const now = Date.now();
  dispatch(startBooking({
    id: 'FLT-AX123',
    carrier: 'Aurora',
    flightNo: 'AX123',
    depart: new Date(now + 86_400_000).toISOString(),
    arrive: new Date(now + 86_400_000 + 2.5*60*60*1000).toISOString(),
    price: 1890
  }));
};