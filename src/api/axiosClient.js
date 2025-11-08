import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

const axiosClient = axios.create({
  baseURL: 'https://berrysalon.onrender.com', //'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;