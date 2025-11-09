import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import axios from "axios";
import Sidebar from "../Components/Sidebar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const baseURL = 'https://berrysalon.onrender.com';

const Dashboard = ({ token }) => {
  const [today, setToday] = useState([]);
  const [month, setMonth] = useState([]);
  const [services, setServices] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [repeatUser, setRepeatUser] = useState([]);


  useEffect(() => {
    axiosClient.get("/today/appointments").then((res) => setToday(res.data));

    axios.get(`${baseURL}/month/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setAppointments(res.data));


    // axiosClient.get("/month/appointments").then((res) => setMonth(res.data));
    
    axiosClient.get("/services").then((res) => setServices(res.data));
    // Fetch popular services
    axiosClient.get("/month/appointments/popular").then((res) => setPopularServices(res.data));
    axiosClient.get("/month/appointments/repeat-users").then((res) => setRepeatUser(res.data));

  }, [token]);

  const revenue = month.reduce((sum, a) => sum + (a.Price || 0), 0);
  const pending = month.filter((a) => a.status === "Awaiting Confirmation").length;

  // Group revenue by day
  const dailyData = Object.values(
    month.reduce((acc, a) => {
      const day = a.appointment_date;
      acc[day] = acc[day] || { day, total: 0 };
      acc[day].total += a.Price || 0;
      return acc;
      }, {})
    );

  //Group revenue by month
    const monthlyData = Object.values(
      month.reduce((acc, a) => {
        const month = a.appointment_date.slice(0, 7); // YYYY-MM
        acc[month] = acc[month] || { month, total: 0 };
        acc[month].total += a.Price || 0;
        return acc;
      }, {})
    );

  return (
    <>
        <div className="fluid-container" style={{ display: "flex" }}>

            <Sidebar />
            {/* </div>
            <div className="p-4"> */}
        
            
            <div className="p-4">
            <Row className="mt-3">
                <h4 style={{paddingBottom: '30px'}}>Dashboard Overview</h4>
                <Col><Card body>Appointments Today: {today.length}</Card></Col>
                <Col><Card body>Revenue This Month: R{revenue}</Card></Col>
                <Col><Card body>Pending Confirmations: {pending}</Card></Col>
                <Col><Card body>Total Services: {services.length}</Card></Col>


                <h5>Revenue by Day</h5>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dailyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0d6efd" />
                    </BarChart>
                </ResponsiveContainer>

                <h5>Revenue by Month</h5>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0d6efd" />
                    </BarChart>
                </ResponsiveContainer>
            </Row>

            <div className="md-4">
                <Row className="mb-4">
                    <Col md={6}>
                      <Card>
                          <Card.Header>Most Popular Services (This Month)</Card.Header>
                          <Card.Body>
                          <Table striped bordered hover>
                              <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Service Name</th>
                                  <th>Total Bookings</th>
                              </tr>
                              </thead>
                              <tbody>
                              {popularServices.length > 0 ? (
                                  popularServices.map((service, index) => (
                                  <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{service.service_name}</td>
                                      <td>{service.total_bookings}</td>
                                  </tr>
                                  ))
                              ) : (
                                  <tr>
                                  <td colSpan="3" className="text-center">
                                      No bookings yet this month
                                  </td>
                                  </tr>
                              )}
                              </tbody>
                          </Table>
                          </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                          <Card.Header>Regular Client (This Month)</Card.Header>
                          <Card.Body>
                          <Table striped bordered hover>
                              <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Total Bookings</th>
                              </tr>
                              </thead>
                              <tbody>
                              {repeatUser.length > 0 ? (
                                  repeatUser.map((client, index) => (
                                  <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{client.name}</td>
                                      <td>{client.appointment_count}</td>
                                  </tr>
                                  ))
                              ) : (
                                  <tr>
                                  <td colSpan="3" className="text-center">
                                      No bookings yet this month
                                  </td>
                                  </tr>
                              )}
                              </tbody>
                          </Table>
                          </Card.Body>
                      </Card>
                    </Col>
                </Row>
                
            </div>
            </div>
        </div>
    </>
    
  );
};

export default Dashboard;
