// ImageModal.jsx (Updated)
import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa'; // Import trash icon

/**
 * ImageModal Component
 * A modal/lightbox for viewing images with navigation, swipe, and delete support.
 */
const ImageModal = ({ show, onHide, images, currentIndex, goToPrev, goToNext, onDelete }) => {
    
    // ... (Touch/Swipe Logic remains the same) ...
    const touchStartX = useRef(null);

    if (!show || images.length === 0) {
        return null;
    }

    const currentImage = images[currentIndex];

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (touchStartX.current === null) {
            return;
        }

        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) { 
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
            touchStartX.current = null; 
        }
    };

    const handleTouchEnd = () => {
        touchStartX.current = null;
    };

    // New: Handler for the delete button
    const handleDeleteClick = () => {
        if (currentImage && currentImage.id) {
            // Call the onDelete function passed from the parent component
            onDelete(currentImage.id); 
            onHide(); // Close the modal immediately after calling delete
        }
    };

    // --- Component Render ---

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered 
            size="xl" 
            dialogClassName="image-modal-dialog" 
        >
            <Modal.Header closeButton className='border-0 pb-0'>
                {/* Delete Button - Placed in the header for easy access */}
                <Button 
                    variant="danger" 
                    onClick={handleDeleteClick}
                    className="ms-auto" // Push button to the right
                    aria-label="Delete image"
                >
                    <FaTrash /> Delete
                </Button>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center align-items-center p-2"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Previous Button */}
                <Button 
                    variant="link" 
                    className="modal-nav-button prev-button position-absolute start-0 translate-middle-y" 
                    onClick={goToPrev}
                    aria-label="Previous image"
                >
                    <FaChevronLeft size={30} className='text-white-50'/>
                </Button>

                {/* Main Image */}
                <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="img-fluid"
                    style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }}
                />

                {/* Next Button */}
                <Button 
                    variant="link" 
                    className="modal-nav-button next-button position-absolute end-0 translate-middle-y" 
                    onClick={goToNext}
                    aria-label="Next image"
                >
                    <FaChevronRight size={30} className='text-white-50'/>
                </Button>
            </Modal.Body>
            <Modal.Footer className='border-0 pt-0 justify-content-center'>
                <p className='text-muted mb-0'>{`${currentIndex + 1} / ${images.length}`}</p>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;