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

// --- User Authentication API ---

export const registerUser = (userData) => {
  // POST /user -> สร้าง user ใหม่
  return http.post('/users', userData);
};

export const loginUser = (email) => {
  return http.get('/users').then(response => {
    const filteredUsers = Array.isArray(response.data)
      ? response.data.filter(user => user.email === email)
      : [];
    return { ...response, data: filteredUsers };
  });
};
