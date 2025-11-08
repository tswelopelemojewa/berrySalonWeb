import { useState } from 'react';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const baseURL = 'https://berrysalon.onrender.com';

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/admin/login`, { email, password });
      console.log('Results: ', res)
      setToken(res.data.session.access_token);
      console.log('More results: ', res.data.session.access_token);
      setError('');

      navigate('/')

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
