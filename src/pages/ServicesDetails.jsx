import React, {useEffect, useState} from 'react'
import axiosClient from '../api/axiosClient';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { IoIosAddCircleOutline } from "react-icons/io";

const baseURL = 'https://berrysalon.onrender.com';


const ServicesDetails = () => {
    const { id } = useParams();
    const [serviceDetails, setServiceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const res = await axiosClient.get(`/services/${id}`);
                console.log('Fetched service details:', res.data);
                setServiceDetails(res.data);
                setItems(res.data || []);
            } catch (err) {
                setError('Error fetching service details');
            } finally {
                setLoading(false);
            }
    };     fetchServiceDetails();
    }, [id]);

    

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;
  if (!items || items.length === 0)
    return <div className="text-center my-5">No services found for this category.</div>;


  return (
    <Container className="my-5">
        <h2 className="text-center mb-4 services-title" style={{padding: "20px"}}>{items[0].name}</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            <Card className="service-card h-100 text-center">   
                <div className="service-img-container">
                    <Link to={`/services/${id}/add`} className="add-service-link">
                        <IoIosAddCircleOutline className="add-icon" />
                        {/* <div className="service-description service-img">ADD NEW PHOTO</div> */}
                    </Link>
                    
                </div>
            </Card>

            {serviceDetails.map((detail) => (
                <Col key={detail.id}>
                <Card className="service-card h-100 text-center">   
                    <div className="service-img-container">
                        <Card.Img   
                            variant="top"
                            src={
                                detail.Image
                                ? (detail.Image.startsWith('http')
                                    ? detail.Image
                                    : `${baseURL}/${detail.Image}`) // ✅ use backend port (5000)
                                : '/default-image.png'      
                            }
                            alt={detail.name}
                            className="service-img"
                        />  
                    </div>
                </Card>
                </Col>
            ))}
        </Row>
    </Container>
  )
}

export default ServicesDetails