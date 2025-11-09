// ImageModal.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
// import jwtDecode from 'jwt-decode'; // Optional: if you want to check real role

const ImageModal = ({ show, onHide, images, currentIndex, goToPrev, goToNext, onDelete }) => {
  const touchStartX = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🟢 Check login/admin status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);

  }, []);

  if (!show || !images || images.length === 0) return null;
  const currentImage = images[currentIndex];

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToNext() : goToPrev();
      touchStartX.current = null;
    }
  };
  const handleTouchEnd = () => (touchStartX.current = null);

  const handleDeleteClick = () => {
    if (currentImage && currentImage.id) {
      onDelete(currentImage.id);
      onHide(); // Close after deleting
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      dialogClassName="image-modal-dialog"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        {/* 🧩 Show Delete only if Admin */}
        {isAdmin && (
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            className="ms-auto"
            aria-label="Delete image"
          >
            <FaTrash /> Delete
          </Button>
        )}
      </Modal.Header>

      <Modal.Body
        className="d-flex justify-content-center align-items-center p-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous */}
        <Button
          variant="link"
          className="modal-nav-button prev-button position-absolute start-0 translate-middle-y"
          onClick={goToPrev}
          aria-label="Previous image"
        >
          <FaChevronLeft size={30} className="text-white-50" />
        </Button>

        {/* Image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt || 'Service image'}
          className="img-fluid"
          style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }}
        />

        {/* Next */}
        <Button
          variant="link"
          className="modal-nav-button next-button position-absolute end-0 translate-middle-y"
          onClick={goToNext}
          aria-label="Next image"
        >
          <FaChevronRight size={30} className="text-white-50" />
        </Button>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <p className="text-muted mb-0">{`${currentIndex + 1} / ${images.length}`}</p>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
