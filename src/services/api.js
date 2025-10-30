import http from './http';

export const getFlights = (params) => {
  return http.get('/flights', { params });
};

export const getFlight = (id) => {
  return http.get(`/flights/${id}`);
};

export const createBooking = (bookingData) => {
  return http.post('/bookings', bookingData);
};

export const cancelBooking = (bookingId) => {
  return http.delete(`/bookings/${bookingId}`);
};

export async function getAirports() {
  const res = await http.get("/airport");
  return res.data; 
}

