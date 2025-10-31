import axios from 'axios';

const API_BASE_URL = 'https://6900a4f3ff8d792314bacf9b.mockapi.io/api/v1';

const API_BOOKINGS_URL ='https://6904c7a26b8dabde49651aa2.mockapi.io/api/v1';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const httpBK = axios.create({
  baseURL: API_BOOKINGS_URL,
  timeout: 10000,
});


export default http;
export { httpBK };

