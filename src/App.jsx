import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Navbar from './Components/Navbar.jsx';
import ServicesDetails from "./pages/ServicesDetails.jsx";
import AddServicePicture from './pages/AddServicePicture.jsx';
import AddNewService from './pages/AddNewService.jsx';
import Appointments from './pages/Appointments.jsx';
import AddNewAppointment from './pages/AddNewAppointment.jsx';  
import ConfirmBooking from './pages/ConfirmBooking.jsx';
import Sidebar from "./Components/Sidebar.jsx";
import Dashboard from './pages/Dashboard.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <Router>  
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/add' element={<AddNewService />} />
        
        <Route path='/about' element={<About />} />
        <Route path='*' element={<div>404 Not Found</div>} />
        
        <Route path='/services/:id' element={<ServicesDetails />} />
        <Route path='/services/:id/add' element={<AddServicePicture />} />

        <Route path='/appointments' element={<Appointments />} />
        <Route path='/new/appointments' element={<AddNewAppointment />} />
        <Route path='/ConfirmBooking' element={<ConfirmBooking />} />

      </Routes>

    </Router>
  )
}

export default App
