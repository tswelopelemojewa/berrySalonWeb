import { useState } from 'react'
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
import Login from './pages/Login.jsx';
import Sidebar from "./Components/Sidebar.jsx";
import Dashboard from './pages/Dashboard.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [token, setToken] = useState('');

  return (
    <Router>  
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin/dashboard' element={ <div> {!token ? <Login setToken={setToken} /> : <Dashboard token={token} />} </div> } />
        <Route path='/services' element={<Services />} />
        <Route path='/services/add' element={<ServiceForm />} />
        <Route path='/services/edit/:id' element={<ServiceForm />} />
        
        <Route path='/about' element={<About />} />
        <Route path='/admin/login' element={<div> <Login setToken={setToken} /></div>} />

        
        
        <Route path='/services/:id' element={<ServicesDetails />} />
        <Route path='/services/:id/add' element={<AddServicePicture />} />

        <Route path='/appointments' element={<Appointments />} />
        <Route path='/new/appointments' element={<AddNewAppointment />} />
        <Route path='/ConfirmBooking' element={<ConfirmBooking />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>

    </Router>
  )
}

export default App
