import React, {useEffect, useState} from 'react'
import axiosClient from '../api/axiosClient';
import { Tab, Nav, Table } from 'react-bootstrap';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCheckCircle, BsCheckCircleFill, BsDashCircleDotted } from "react-icons/bs";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './Appointments.css';

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('today');

  const fetchAppointments = async (type) => {
    try {
      const res = await axiosClient.get(`/${type}/appointments`);
      setAppointments(res.data);
    } catch (error) {
      console.error(`Error fetching ${type} appointments:`, error);
    }
  };

const updateStatus = async (appointmentId, userNumber, action) => {
	try{
		const res = await axiosClient.post(`/${action}`, {
        user: userNumber,
        appointmentId: appointmentId
      });

		if (res.status === 201){
			fetchAppointments(activeTab);
		}
	}catch (error) {
		console.error(`Error updating appointment ${appointmentId}: `, error)
	}
};


  //The main table component
  const AppointmentTable = ({ appointments }) => (
  // <div style={{ marginTop: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
  <>
  {/* <Table striped bordered hover responsive style={{ margin: 0 }}>
    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 2 }} >
      <tr>
        <th>Name</th>
        <th>Contacts</th>
        <th>Date</th>
        <th>StartTime</th>
        <th>EndTime</th>
        <th>Status</th>
        <th>Service</th>
        <th>Duration</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {appointments.map((a) => (
        <tr key={a.id}>
          <td>{a.name}</td>
          <td>{a.user_number}</td>
          <td>{a.appointment_date}</td>
          <td>{a.StartTime}</td>
          <td>{a.EndTime}</td>
          <td>{a.status}</td>
          <td>{a.service_name}</td>
          <td>
            {Math.floor(a.duration_minutes / 60) > 0
              ? `${Math.floor(a.duration_minutes / 60)} hour${
                  Math.floor(a.duration_minutes / 60) > 1 ? 's' : ''
                } ${a.duration_minutes % 60 > 0 ? `${a.duration_minutes % 60} minute${a.duration_minutes % 60 > 1 ? 's' : ''}` : ''}`
              : `${a.duration_minutes} minute${a.duration_minutes > 1 ? 's' : ''}`}
          </td>
          <td>
            <BsDashCircleDotted 
              title="Cancel Appoitment"
              style={{cursor: 'pointer', marginRight: '8px', color: 'red' }}
              onClick={() => updateStatus(a.id, a.user_number, 'cancel')}	
	          /> 
            
            <BsCheckCircle 
              title="Confirm Appointment"
              style={{cursor: 'pointer', marginRight: '8px', color: 'Green'}}
              onClick={() => updateStatus(a.id, a.user_number, 'confirm' )}
            />
            
            <BsCheckCircleFill
              title="Mark AS Complete"
              style={{cursor: 'pointer', color: 'Blue'}}
              onClick={() => updateStatus(a.id, a.user_number, 'complete')}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table> */}

  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
    {appointments.map((a) => (
      <Col key={a.id}>
        <Card className="service-card h-100 text-center">
          {/* ✅ IMAGE SECTION */}
          <Card.Body>
            <h4>{a.name}</h4>

            <p>
              <FaWhatsapp size={22} className="me-3 text-success" />

              <Link
                to={`https://wa.me/${a.user_number}`}
                // href="https://wa.me/27661278895" // 👈 Opens WhatsApp chat directly
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                {a.user_number}
              </Link>
            </p>

            {/* <p>{a.user_number}</p> */}

            <h5>{a.appointment_date}</h5>
            <p>{a.StartTime} - {a.EndTime}</p>
            <p>{a.status}</p>
            <p>{a.service_name}</p>
            <BsDashCircleDotted 
              title="Cancel Appoitment"
              style={{cursor: 'pointer', marginRight: '25px', color: 'red', fontSize: '2rem' }}
              onClick={() => updateStatus(a.id, a.user_number, 'cancel')}	
	          /> 
            
            <BsCheckCircle 
              title="Confirm Appointment"
              style={{cursor: 'pointer', marginRight: '25px', color: 'Green', fontSize: '2rem'}}
              onClick={() => updateStatus(a.id, a.user_number, 'confirm' )}
            />
            
            <BsCheckCircleFill
              title="Mark AS Complete"
              style={{cursor: 'pointer', color: 'Blue', fontSize: '2rem'}}
              onClick={() => updateStatus(a.id, a.user_number, 'complete')}
            />
          </Card.Body>
        </Card>
        
      </Col>
    ))}
  </Row>
      </>

// </div>

);


 useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  return (
    <div style={{  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {/* <div> */}
      <h3 style={{ marginBottom: '20px' }}>Appointments</h3> 
       
      <h5 style={{ marginBottom: '20px' }}>Manage your appointments</h5>
    {/* </div> */}
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
       
        <button className="book-btn" style={{ marginBottom: '10px', border: 'none', padding: '10px 20px', marginRight: '10px', alignItems: 'flex-end' }}>
          <Link to="/new/appointments" style={{ textDecoration: 'none', color: 'white' }}>
          Add Appointment
          </Link>
        </button>
      </div>


      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{ marginBottom: '15px' }}>
        <Nav.Item>
          <Nav.Link eventKey="today">Today</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="upcoming">Upcoming</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="month">This Month</Nav.Link>
        </Nav.Item>
      </Nav>

      <div style={{ width: '100%',
        flexGrow: 1,
        overflowY: 'auto',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        maxHeight: '70vh', }}>
        <AppointmentTable appointments={appointments} />
      </div>
  </div>

  )
}

export default AppointmentsPage