import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';
import Button from 'react-bootstrap/Button';
import './Services.css'; // 👈 import your custom styles
import { Link } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";


const baseURL = "https://berrysalon.onrender.com";

const Services = () => {
  const [services, setServices] = useState([]);
  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosClient.get(`/services`);
        console.log('Fetched services:', res.data);
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    
    <Container className="my-5">
      <h2 className="text-center mb-4 services-title" style={{padding: "20px"}} >Our Beauty Services</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      <Card className="service-card h-100 text-center">   
            <div className="service-img-container">
                <Link to={'/services/Add'} className="add-service-link">
                    <IoIosAddCircleOutline className="add-icon" />  
                </Link>
                
            </div>
        </Card>
        {services.map((service) => (
          <Col key={service.id}>
            <Card className="service-card h-100 text-center">
              {/* ✅ IMAGE SECTION */}
              <div className="service-img-container">
                <Link to={`/services/${service.id}`}>
                  <Card.Img
                    variant="top"
                    src={
                      service.coverimg
                        ? (service.coverimg.startsWith('http')
                          ? service.coverimg
                          : `${baseURL}/${service.coverimg}`) // ✅ use backend port (5000)
                        : `${baseURL}/uploads/doma.jpg`
                    }
                    alt={service.name}
                    className="service-img"
                  />
                </Link>
              </div>

              {/* ✅ CARD BODY */}
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text className="text-muted small">{service.description}</Card.Text>
                <p>
                  ⏱ {Math.floor(service.duration_minutes / 60) > 0
                    ? `${Math.floor(service.duration_minutes / 60)} hour${
                        Math.floor(service.duration_minutes / 60) > 1 ? 's' : ''
                      } ${service.duration_minutes % 60 > 0 ? `${service.duration_minutes % 60} minute${service.duration_minutes % 60 > 1 ? 's' : ''}` : ''}`
                    : `${service.duration_minutes} minute${service.duration_minutes > 1 ? 's' : ''}`}
                </p>
                <p className="service-price">💅 R{service.Price}</p>
                <Link to={`/services/${service.id}`}>
                  <Button variant="primary" className="book-btn">View More</Button>
                </Link>
                
              </Card.Body>
            </Card>
            
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;
