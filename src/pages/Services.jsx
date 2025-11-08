import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';
import Button from 'react-bootstrap/Button';
import './Services.css';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import { IoIosAddCircleOutline } from "react-icons/io";
// Import icons for the new buttons
import { FaEdit, FaTrash } from 'react-icons/fa'; 


const baseURL = "https://berrysalon.onrender.com";

const Services = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate(); // 👈 Initialize useNavigate for the Edit button

    // 1. Unified Fetch function
    const fetchServices = async () => {
        try {
            const res = await axiosClient.get(`/services`);
            console.log('Fetched services:', res.data);
            setServices(res.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // 2. Handle Delete Function
    const handleDelete = async (serviceId) => {
        // Confirmation dialog for safety
        if (!window.confirm(`Are you sure you want to delete service ID ${serviceId}? This action is permanent.`)) {
            return;
        }

        try {
            // Call the DELETE API endpoint
            await axiosClient.delete(`/services/${serviceId}`);
            
            // On success, update the state by filtering out the deleted service
            setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
            // alert('Service deleted successfully!');
        } catch (error) {
            console.error('Error deleting service:', error);
            // Check for specific error status if needed (e.g., 404, 409)
            alert('Failed to delete service. Check server logs.');
        }
    };
    
    // 3. Handle Update (Navigation) Function
    const handleUpdate = (serviceId) => {
        // You'll need a new route/component for the actual update form, e.g., /services/edit/:id
        navigate(`/services/edit/${serviceId}`); 
        // NOTE: Make sure you set up this new route in your React Router configuration!
    };


    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 services-title" style={{padding: "20px"}} >Our Beauty Services</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            
            {/* The 'Add New Service' Card */}
            <Card className="service-card h-100 text-center">   
                <div className="service-img-container">
                    <Link to={'/services/Add'} className="add-service-link">
                        <IoIosAddCircleOutline className="add-icon" />  
                    </Link>
                </div>
            </Card>
            
            {/* Map through existing services */}
            {services.map((service) => (
                <Col key={service.id}>
                    <Card className="service-card h-100 text-center">
                        {/* Image Section */}
                        <div className="service-img-container">
                            <Link to={`/services/${service.id}`}>
                                <Card.Img
                                    variant="top"
                                    src={
                                        service.coverImg
                                            ? service.coverImg 
                                            : `https://bygwxdfqsfvxfcgoyxzx.supabase.co/storage/v1/object/public/services/default_cover.jpg` // Use a proper default
                                    }
                                    alt={service.name}
                                    className="service-img"
                                />
                            </Link>
                        </div>

                        {/* Card Body */}
                        <Card.Body>
                            <Card.Title>{service.name}</Card.Title>
                            <Card.Text className="text-muted small">{service.description}</Card.Text>
                            {/* Duration and Price display logic here... */}
                            <p className="service-price">💅 R{service.Price}</p>
                            
                            {/* 4. Action Buttons Container */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <Link to={`/services/${service.id}`}>
                                    <Button variant="primary" className="book-btn">View More</Button>
                                </Link>
                                
                                {/* Update Button */}
                                <Button 
                                    variant="warning" 
                                    size="sm" 
                                    onClick={() => handleUpdate(service.id)} 
                                    title="Edit Service"
                                    className="mx-1"
                                >
                                    <FaEdit />
                                </Button>
                                
                                {/* Delete Button */}
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => handleDelete(service.id)} 
                                    title="Delete Service"
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                            
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>
        </Container>
    );
};

export default Services;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import axiosClient from '../api/axiosClient';
// import Button from 'react-bootstrap/Button';
// import './Services.css'; // 👈 import your custom styles
// import { Link } from 'react-router-dom';
// import { IoIosAddCircleOutline } from "react-icons/io";


// const baseURL = "https://berrysalon.onrender.com";

// const Services = () => {
//   const [services, setServices] = useState([]);
  

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const res = await axiosClient.get(`/services`);
//         console.log('Fetched services:', res.data);
//         setServices(res.data);
//       } catch (error) {
//         console.error('Error fetching services:', error);
//       }
//     };
//     fetchServices();
//   }, []);

//   return (
    
//     <Container className="my-5">
//       <h2 className="text-center mb-4 services-title" style={{padding: "20px"}} >Our Beauty Services</h2>
//       <Row xs={1} sm={2} md={3} lg={4} className="g-4">
//       <Card className="service-card h-100 text-center">   
//             <div className="service-img-container">
//                 <Link to={'/services/Add'} className="add-service-link">
//                     <IoIosAddCircleOutline className="add-icon" />  
//                 </Link>
                
//             </div>
//         </Card>
//         {services.map((service) => (
//           <Col key={service.id}>
//             <Card className="service-card h-100 text-center">
//               {/* ✅ IMAGE SECTION */}
//               <div className="service-img-container">
//                 <Link to={`/services/${service.id}`}>
//                   <Card.Img
//                     variant="top"
//                     src={
//                       service.coverImg
//                         ? service.coverImg 
//                         : `https://bygwxdfqsfvxfcgoyxzx.supabase.co/storage/v1/object/public/services/1760528900400.jpg`
//                     }
//                     alt={service.name}
//                     className="service-img"
//                   />
//                 </Link>
//               </div>

//               {/* ✅ CARD BODY */}
//               <Card.Body>
//                 <Card.Title>{service.name}</Card.Title>
//                 <Card.Text className="text-muted small">{service.description}</Card.Text>
//                 <p>
//                   ⏱ {Math.floor(service.duration_minutes / 60) > 0
//                     ? `${Math.floor(service.duration_minutes / 60)} hour${
//                         Math.floor(service.duration_minutes / 60) > 1 ? 's' : ''
//                       } ${service.duration_minutes % 60 > 0 ? `${service.duration_minutes % 60} minute${service.duration_minutes % 60 > 1 ? 's' : ''}` : ''}`
//                     : `${service.duration_minutes} minute${service.duration_minutes > 1 ? 's' : ''}`}
//                 </p>
//                 <p className="service-price">💅 R{service.Price}</p>
//                 <Link to={`/services/${service.id}`}>
//                   <Button variant="primary" className="book-btn">View More</Button>
//                 </Link>
                
//               </Card.Body>
//             </Card>
            
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default Services;
