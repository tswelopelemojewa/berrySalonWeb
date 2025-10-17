import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { homeStyle } from '../Components/Navbar';

const AddNewService = () => {
    const navigate = useNavigate();
    const [formData, useFormData] = useState({
        name: '',
        Price: '',
        duration_minutes: '',
    });
    const [coverImg, setCoverImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Handle text input changed
    const handleChange = (e) => {
        useFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    //Handle file input changes
    const handleFileChange = (e) => {
        setCoverImg(e.target.files[0]);
    };

    //Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if(!formData.name || !formData.Price || !formData.duration_minutes) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if(!coverImg) {
            setError("Please select a cover image.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('Price', formData.Price);
        data.append('duration_minutes', formData.duration_minutes);

        data.append('coverImg', coverImg);
        try {
            const res = await axiosClient.post('/services/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }, 
            });
            console.log('Service created:', res.data);
            alert('Service created successfully!');
            navigate(`/services/${res.data.id}`);

        } catch (err) {
            console.error('Error creating service:', err);
            setError('Failed to create service. Please try again.');
        } finally {
        setLoading(false);
        }
    };

return (
    <div style={homeStyle}>
    
    <div className='form-control' style={{ maxWidth: "600px", margin: "auto", padding: "30px" }} >
        <h3 style={{paddingBottom: "30px"}}>Add New Service</h3>

        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ marginBottom: "10px" }}>
                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                    Name:
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control 
                        type="text" 
                        name="name"
                        placeholder='Natural Look'
                        value={formData.name}
                        onChange={handleChange}
                        required />
                    </Col>
                </Form.Group> 
        </div>
        
        <div style={{ marginBottom: "10px" }}>
            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                <Form.Label column sm="2">Price:</Form.Label>
                <Col sm="10">
                <Form.Control 
                    type="number"
                    name="Price"
                    placeholder='500'
                    value={formData.Price}
                    onChange={handleChange}
                    required
                    />
                </Col>
            </Form.Group>     
        </div>

        <div style={{ marginBottom: "10px" }}>
            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                <Form.Label column sm="2">Duration:</Form.Label>
                <Col sm="10">
                    <Form.Control 
                        type="number"
                        name="duration_minutes"
                        placeholder='60  = 1 hour'
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Form.Group>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <Form.Group as={Row} className="mb-2" controlId="formFileMultiple">
            <Form.Label column sm="2">Cover:</Form.Label>
            <Col sm="10">
            <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} required  />
            </Col>
          </Form.Group>
        </div>

        {coverImg && (
          <div style={{ marginBottom: "10px" }}>
            <img
              src={URL.createObjectURL(coverImg)}
              alt="Preview"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <button style={{ marginTop: "10px" }} className='btn btn-success' type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Service"}
        </button>
        </form>
    </div>
    </div>
  )
}

export default AddNewService