// ===========================
// Imports
// ===========================
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';


// ===========================
// Config / ENV
// ---------------------------
// อ่านค่าคอนฟิกจาก .env (มี default เผื่อกรณีไม่ตั้งค่า)
// ===========================
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
const BOOKINGS_PATH = process.env.REACT_API_BOOKINGS_URL || '/bookings';
const FAKE_CONFIRM = String(process.env.REACT_APP_FAKE_CONFIRM_ON_ERROR).toLowerCase() === 'true';
const SEAT_RESERVE_PATH = process.env.REACT_APP_SEAT_RESERVE_PATH || '/seat-reservations';


// ===========================
// Async Thunk: submitBooking
// ---------------------------
// ขั้นตอน:
// 1) POST สร้าง booking ไปที่ API
//    - ถ้า error และตั้งค่า FAKE_CONFIRM=true => สร้าง confirmation ปลอมให้ผ่าน
// 2) พยายาม reserve seat (best-effort) ไม่บล็อกการยืนยัน
// 3) คืนค่า confirmation (bookingId, pnr ฯลฯ)
// ===========================
export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (payload, { rejectWithValue, signal }) => {
    const randomPNR = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 34)]).join('');
    const asConfirmation = (data) => ({
      ...data,
      bookingId: data?.bookingId || data?.id || `FAKE-${Date.now()}`,
      pnr: data?.pnr || randomPNR()
    });
    try {
      // 1) Create booking
      const res = await fetch(`${API_BASE}${BOOKINGS_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal
      });
      let confirmation;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (FAKE_CONFIRM) {
          confirmation = asConfirmation(payload);
        } else {
          return rejectWithValue({ status: res.status, message: err?.message || 'Failed to submit booking' });
        }
      } else {
        const data = await res.json();
        confirmation = asConfirmation(data);
      }

      // 2) Reserve seat (best-effort; do not block confirmation)
      try {
        const seatCode = payload?.extras?.seatPref;
        if (seatCode && seatCode !== 'AUTO') {
          await fetch(`${API_BASE}${SEAT_RESERVE_PATH}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              flightId: payload?.flightId || payload?.flight?.id || payload?.flight_id,
              seat: seatCode,
              status: 'RESERVED',
              bookingId: confirmation.bookingId,
            }),
            signal
          }).catch(()=>{});
        }
      } catch (_) { /* ignore seat reserve errors */ }

      return confirmation;
    } catch (e) {
      if (FAKE_CONFIRM) {
        return asConfirmation(payload);
      }
      return rejectWithValue({ message: e.message || 'Network error' });
    }
  }
);

// ===========================
// Initial State
// ---------------------------
// โครงสร้าง state เริ่มต้นสำหรับการจอง
// ===========================
const initialState = {
  id: null, // local temp id for UI
  flight: null, // {id, carrier, flightNo, depart, arrive, price}
  returnFlight: null, // optional return leg {id, carrier, flightNo, depart, arrive, price}
  passengers: [
    // {id, firstName, lastName, gender, dob, type:'ADT'|'CHD'|'INF'}
  ],
  contact: { email: '', phone: '' },
  extras: { baggageKg: 0, seatPref: 'AUTO', seats: [] },
  price: { base: 0, taxes: 0, extras: 0, total: 0, currency: 'THB' },
  step: 1, // 1: form, 2: summary, 3: confirmation
  status: 'idle', // idle|loading|succeeded|failed
  error: null,
  confirmation: null // {bookingId, pnr, ...}
};


// ===========================
// Helper: recomputePrice(state)
// ---------------------------
// คำนวณราคาใหม่จาก:
// - base จาก flight.price
// - taxes 7% (เดโม)
// - extraBag = 35 THB/kg (เดโม)
// - total = base + taxes + extras
// ===========================
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


// ===========================
// Slice: bookingSlice
// ---------------------------
// รวม reducers และ extraReducers ที่เกี่ยวกับการจอง
// ===========================
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // อัปเดตข้อมูลเที่ยวบิน + คำนวณราคาใหม่
    updateFlight(state, action) { state.flight = { ...(state.flight||{}), ...(action.payload||{}) }; recomputePrice(state); },

    // เริ่มต้นการจองใหม่จาก flight ที่เลือก
    startBooking: {
      reducer(state, action) {
        const { flight } = action.payload;
        state.id = nanoid();
        state.flight = flight;
        state.returnFlight = null;
        state.step = 1;
        state.status = 'idle';
        state.error = null;
        state.confirmation = null;
        state.passengers = [{ id: nanoid(), firstName: '', lastName: '', gender: 'UNSPEC', dob: '', type: 'ADT' }];
        state.contact = { email: '', phone: '' };
        state.extras = { baggageKg: 0, seatPref: 'AUTO', seats: [] };
        recomputePrice(state);
      },
      prepare(flight) {
        return { payload: { flight } };
      }
    },
    updateReturnFlight(state, action) {
      state.returnFlight = { ...(state.returnFlight || {}), ...(action.payload || {}) };
    },

    // เพิ่มผู้โดยสารใหม่ (ค่าเริ่มต้นเป็น ADT)
    addPassenger(state) {
      state.passengers.push({ id: nanoid(), type: 'ADT', gender: 'UNSPEC', firstName: '', lastName: '', dob: '' });
    },

    // ลบผู้โดยสารตาม id
    removePassenger(state, action) {
      state.passengers = state.passengers.filter(p => p.id !== action.payload);
    },

    // อัปเดตฟิลด์ของผู้โดยสารตาม id
    updatePassenger(state, action) {
      const { id, changes } = action.payload;
      const idx = state.passengers.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.passengers[idx] = { ...state.passengers[idx], ...changes };
      }
    },

    // อัปเดตข้อมูลผู้ติดต่อ
    updateContact(state, action) {
      state.contact = { ...state.contact, ...action.payload };
    },

    // อัปเดต extras (เช่น กระเป๋า/ที่นั่ง) + คำนวณราคาใหม่
    updateExtras(state, action) {
      state.extras = { ...state.extras, ...action.payload };
      recomputePrice(state);
    },

    // ไปหน้า Summary
    goToSummary(state) {
      state.step = 2;
    },

    // กลับไปหน้า Form
    backToForm(state) {
      state.step = 1;
    },

    // รีเซ็ต state ทั้งหมด
    resetBooking() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // สถานะตอนส่งจอง (เรียก submitBooking)
      .addCase(submitBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // สำเร็จ: เก็บ confirmation และไป step 3
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.confirmation = action.payload;
        state.step = 3;
      })
      // ล้มเหลว: เก็บข้อความผิดพลาด
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Submit failed';
      });
  }
});


// ===========================
// Exports: actions, selectors, reducer
// ===========================
 export const {
  startBooking,
  addPassenger,
  removePassenger,
  updatePassenger,
  updateContact,
  updateExtras,
  goToSummary,
  backToForm,
  resetBooking,
  updateFlight,
  updateReturnFlight
} = bookingSlice.actions;

export const selectBooking = (state) => state.booking;
export const selectPrice = (state) => state.booking.price;
export const selectStep = (state) => state.booking.step;

export default bookingSlice.reducer;
