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



// --- User Authentication API ---

export const registerUser = (userData) => {
  // POST /user -> สร้าง user ใหม่
  return http.post('/users', userData);
};

export const loginUser = (email) => {
  // GET /user?email={email} -> ค้นหา user จาก email
  // MockAPI.io อาจไม่ได้กรองข้อมูลตาม query params ได้อย่างสมบูรณ์
  // ดังนั้น เราจะทำการกรองข้อมูลฝั่ง client-side อีกครั้งเพื่อความถูกต้อง
  return http.get('/users', { params: { email } }).then(response => {
    const filteredUsers = Array.isArray(response.data)
      ? response.data.filter(user => user.email === email)
      : [];
    return { ...response, data: filteredUsers };
  });
};
