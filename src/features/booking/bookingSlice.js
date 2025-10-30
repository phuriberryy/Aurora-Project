import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (payload, { rejectWithValue, signal }) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return rejectWithValue({
          status: res.status,
          message: err?.message || 'Failed to submit booking'
        });
      }
      const data = await res.json();
      const randomPNR = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 34)]).join('');
      const confirmation = {
        ...data,
        bookingId: data.bookingId || data.id,
        pnr: data.pnr || randomPNR()
      };
      return confirmation;
    } catch (e) {
      return rejectWithValue({ message: e.message || 'Network error' });
    }
  }
);

const initialState = {
  id: null, // local temp id for UI
  flight: null, // {id, carrier, flightNo, depart, arrive, price}
  passengers: [
    // {id, firstName, lastName, gender, dob, type:'ADT'|'CHD'|'INF'}
  ],
  contact: { email: '', phone: '' },
  extras: { baggageKg: 0, seatPref: 'AUTO' },
  price: { base: 0, taxes: 0, extras: 0, total: 0, currency: 'THB' },
  step: 1, // 1: form, 2: summary, 3: confirmation
  status: 'idle', // idle|loading|succeeded|failed
  error: null,
  confirmation: null // {bookingId, pnr, ...}
};

const recomputePrice = (state) => {
  const base = Number(state?.flight?.price || 0);
  const taxes = base > 0 ? Math.round(base * 0.07) : 0; // demo VAT 7%
  const extraBag = (state.extras.baggageKg || 0) * 35; // THB per kg demo
  const extras = extraBag;
  state.price.base = base;
  state.price.taxes = taxes;
  state.price.extras = extras;
  state.price.total = base + taxes + extras;
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBooking: {
      reducer(state, action) {
        const { flight } = action.payload;
        state.id = nanoid();
        state.flight = flight;
        state.step = 1;
        state.status = 'idle';
        state.error = null;
        state.confirmation = null;
        state.passengers = [{ id: nanoid(), firstName: '', lastName: '', gender: 'UNSPEC', dob: '', type: 'ADT' }];
        state.contact = { email: '', phone: '' };
        state.extras = { baggageKg: 0, seatPref: 'AUTO' };
        recomputePrice(state);
      },
      prepare(flight) {
        return { payload: { flight } };
      }
    },
    addPassenger(state) {
      state.passengers.push({ id: nanoid(), type: 'ADT', gender: 'UNSPEC', firstName: '', lastName: '', dob: '' });
    },
    removePassenger(state, action) {
      state.passengers = state.passengers.filter(p => p.id !== action.payload);
    },
    updatePassenger(state, action) {
      const { id, changes } = action.payload;
      const idx = state.passengers.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.passengers[idx] = { ...state.passengers[idx], ...changes };
      }
    },
    updateContact(state, action) {
      state.contact = { ...state.contact, ...action.payload };
    },
    updateExtras(state, action) {
      state.extras = { ...state.extras, ...action.payload };
      recomputePrice(state);
    },
    goToSummary(state) {
      state.step = 2;
    },
    backToForm(state) {
      state.step = 1;
    },
    resetBooking() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.confirmation = action.payload;
        state.step = 3;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Submit failed';
      });
  }
});

export const {
  startBooking,
  addPassenger,
  removePassenger,
  updatePassenger,
  updateContact,
  updateExtras,
  goToSummary,
  backToForm,
  resetBooking
} = bookingSlice.actions;

export const selectBooking = (state) => state.booking;
export const selectPrice = (state) => state.booking.price;
export const selectStep = (state) => state.booking.step;

export default bookingSlice.reducer;





