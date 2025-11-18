// ServicesDetails.jsx (Updated)
import React, {useEffect, useState, useCallback} from 'react'
import axiosClient from '../api/axiosClient';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import ImageModal from '../Components/ImageModal'; 

const baseURL = 'https://berrysalon.onrender.com';

const ServicesDetails = () => {
    const { id } = useParams();
    const [serviceDetails, setServiceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (index) => {
        setCurrentIndex(index);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    // Navigation functions for the modal
    const goToNext = useCallback(() => {
        if (serviceDetails) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % serviceDetails.length);
        }
    }, [serviceDetails]);

    const goToPrev = useCallback(() => {
        if (serviceDetails) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + serviceDetails.length) % serviceDetails.length);
        }
    }, [serviceDetails]);


    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const res = await axiosClient.get(`/services/${id}`);
                const fetchedDetails = Array.isArray(res.data) ? res.data : []; 
                setServiceDetails(fetchedDetails);
                setItems(fetchedDetails);

                // Check if an admin token exists in localStorage
                const token = localStorage.getItem('token');
                setIsAdmin(!!token); // true if logged in
            } catch (err) {
                setError('Error fetching service details');
            } finally {
                setLoading(false);
            }
        };
        fetchServiceDetails();
    }, [id]);

    // **NEW DELETE HANDLER**
    const handleDelete = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            // Your API endpoint to delete an image in the 'gallery' table
            // Assuming your backend handles the Supabase deletion via this route
            await axiosClient.delete(`/gallery/${imageId}`); 
            
            // 1. Filter out the deleted image from the state
            const updatedDetails = serviceDetails.filter(detail => detail.id !== imageId);
            setServiceDetails(updatedDetails);
            setItems(updatedDetails);

            // 2. Adjust currentIndex if it's out of bounds after deletion
            if (updatedDetails.length === 0) {
                closeModal(); // Close modal if no images are left
            } else if (currentIndex >= updatedDetails.length) {
                // If the last image was deleted, go to the new last image (length - 1)
                setCurrentIndex(updatedDetails.length - 1); 
            }
            
            // alert('Image deleted successfully!');
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Error deleting image. Please try again.');
        }
    };

    // Keyboard navigation (existing logic)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showModal) {
                if (e.key === 'ArrowRight') {
                    goToNext();
                } else if (e.key === 'ArrowLeft') {
                    goToPrev();
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal, goToNext, goToPrev]);

    

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="text-center text-danger my-5">{error}</div>;
    
    const imagesAvailable = serviceDetails && serviceDetails.length > 0;

    if (!imagesAvailable) {
      return (
        <>
  {isAdmin ? (
    // IF ADMIN
    <div className="text-center my-5">
      <Card className="service-card h-100 text-center">
        <div className="service-img-container">
          <Link to={`/services/${id}/add`} className="add-service-link">
            <IoIosAddCircleOutline className="add-icon" />
          </Link>
        </div>
      </Card>
      <p className="mt-3">No images found. Click the '+' to add one!</p>
    </div>
  ) : (
    // ELSE (NOT ADMIN)
    <div className="text-center my-5">
      <Card className="service-card h-100 text-center">
        <div className="service-img-container">
          <p className="mt-3">No images added yet.</p>
        </div>
      </Card>
    </div>
  )}
</>

      );
    }


    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 services-title" style={{padding: "20px"}}>{items.length > 0 ? items[0].name : 'Service Images'}</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {/* The "Add New Photo" card */}
                {isAdmin && (
                    <Col>
                        <Card className="service-card h-100 text-center">   
                            <div className="service-img-container">
                                <Link to={`/services/${id}/add`} className="add-service-link">
                                    <IoIosAddCircleOutline className="add-icon" />
                                </Link>
                            </div>
                        </Card>
                    </Col> 
                )}

                {/* Mapped Service Images */}
                {serviceDetails.map((detail, index) => (
                    <Col key={detail.id}>
                        <Card className="service-card h-100 text-center">
                            <div className="service-img-container">
                                <Card.Img 
                                    variant="top"
                                    src={detail.image ? detail.image : '/default-image.png'}
                                    alt={detail.name}
                                    className="service-img clickable-img" 
                                    onClick={() => openModal(index)} 
                                />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Image Modal Component - Passed the new onDelete prop */}
            {serviceDetails && serviceDetails.length > 0 && (
                <ImageModal
                    show={showModal}
                    onHide={closeModal}
                    images={serviceDetails.map(d => ({ 
                        id: d.id, // **IMPORTANT: Pass the image ID**
                        src: d.image || '/default-image.png', 
                        alt: d.name 
                    }))}
                    currentIndex={currentIndex}
                    goToPrev={goToPrev}
                    goToNext={goToNext}
                    onDelete={handleDelete} // **NEW PROP**
                />
            )}
        </Container>
    );
}

export default ServicesDetails;
