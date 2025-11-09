import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Navbar from './Components/Navbar.jsx';
import ServicesDetails from "./pages/ServicesDetails.jsx";
import AddServicePicture from './pages/AddServicePicture.jsx';
import ServiceForm from './pages/ServiceForm.jsx';
import Appointments from './pages/Appointments.jsx';
import AddNewAppointment from './pages/AddNewAppointment.jsx';  
import ConfirmBooking from './pages/ConfirmBooking.jsx';
import Policy from './pages/Policy.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Save token on login
  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/add' element={<ServiceForm />} />
        <Route path='/services/edit/:id' element={<ServiceForm />} />
        <Route path='/about' element={<About />} />
        <Route path='/services/:id' element={<ServicesDetails />} />
        <Route path='/services/:id/add' element={<AddServicePicture />} />
        <Route path='/new/appointments' element={<AddNewAppointment />} />
        <Route path='/ConfirmBooking' element={<ConfirmBooking />} />
        <Route path='/policy' element={<Policy />} />
        <Route path='/admin/login' element={<Login setToken={handleSetToken} />} />

        {/* Protected Routes */}
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute token={token}>
              <Dashboard token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/appointments'
          element={
            <ProtectedRoute token={token}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
