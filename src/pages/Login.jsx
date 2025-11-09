import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, ButtonGroup, Badge, Spinner, Alert } from 'react-bootstrap';

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
    <form className='form-control' onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', padding: '30px' }}>
      <h3>Admin Login</h3> <br />
       {/* Name */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formEmail">
            <Form.Label column sm="3">Email:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                name="name"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
        </div>

       {/* Password */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formPassword">
            <Form.Label column sm="3">Password:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="password"
                name="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
        </div>

      {/* <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
       */}

      <button type="submit" className='btn btn-success'>Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
