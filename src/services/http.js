import axios from 'axios';

const API_BASE_URL = 'https://api.aurora-airways.dev/v1'; // ตัวอย่าง URL API

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export default http;

