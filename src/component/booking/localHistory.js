// Lightweight local JSON history store for previous bookings
// Stores minimal data to enforce duplicate checks (names, seats per flight)

import seedHistory from './booking-history.json';

const KEY = 'aurora_booking_history';

const safeGet = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      // seed from bundled json on first run
      const arr = Array.isArray(seedHistory) ? seedHistory : [];
      window.localStorage.setItem(KEY, JSON.stringify(arr));
      return arr;
    }
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
};

const safeSet = (arr) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (_) {
    // ignore
  }
};

export const loadHistory = () => safeGet();

export const addRecord = (record) => {
  const list = safeGet();
  const entry = {
    flightId: record?.flightId || null,
    date: record?.date || null,
    seats: Array.isArray(record?.seats) ? record.seats : [],
    passengerNames: Array.isArray(record?.passengerNames) ? record.passengerNames : [],
    timestamp: Date.now(),
  };
  list.push(entry);
  // Optionally cap the history size to avoid bloat
  const MAX = 200;
  safeSet(list.slice(-MAX));
};

const normName = (s) => String(s || '').trim().toLowerCase();

export const anyNameExists = (fullName) => {
  const target = normName(fullName);
  if (!target) return false;
  const list = safeGet();
  for (const rec of list) {
    const names = Array.isArray(rec?.passengerNames) ? rec.passengerNames : [];
    if (names.some(n => normName(n) === target)) return true;
  }
  return false;
};

export const getReservedSeatsForFlight = (flightId, date) => {
  if (!flightId) return [];
  const list = safeGet();
  const out = new Set();
  for (const rec of list) {
    if (rec.flightId !== flightId) continue;
    if (date && rec.date && String(rec.date) !== String(date)) continue;
    const seats = Array.isArray(rec.seats) ? rec.seats : [];
    seats.forEach(s => out.add(String(s)));
  }
  return Array.from(out);
};

// Store a full booking snapshot for My Bookings page
export const addBookingSnapshot = (snapshot) => {
  const list = safeGet();
  const entry = {
    type: 'booking',
    snapshot: {
      confirmation: snapshot?.confirmation || null,
      flight: snapshot?.flight || null,
      returnFlight: snapshot?.returnFlight || null,
      passengers: Array.isArray(snapshot?.passengers) ? snapshot.passengers : [],
      contact: snapshot?.contact || {},
      extras: snapshot?.extras || {},
      price: snapshot?.price || {},
    },
    timestamp: Date.now(),
  };
  list.push(entry);
  const MAX = 200;
  safeSet(list.slice(-MAX));
};

// Management helpers
export const listHistory = () => safeGet();
export const deleteByTimestamp = (ts) => {
  const list = safeGet().filter(it => Number(it?.timestamp) !== Number(ts));
  safeSet(list);
};
export const clearHistory = () => safeSet([]);

// Legacy no-op exports to avoid breaking imports outside Booking
export const exportHistoryToFile = () => {};
export const importHistoryFromObject = (arr) => { if (Array.isArray(arr)) safeSet(arr); };

// Force clear now (one-off request). This runs on next app load and clears
// stored booking history immediately without needing UI interaction.
try {
  // Only if running in a browser environment
  if (typeof window !== 'undefined' && window.localStorage) {
    safeSet([]);
  }
} catch (_) {
  // ignore
}
