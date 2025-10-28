import axios from 'axios';

const API_BASE_URL = 'https://6900a4f3ff8d792314bacf9b.mockapi.io/api/v1';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export default http;

