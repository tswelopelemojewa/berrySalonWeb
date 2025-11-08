

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // 👈 Added useParams
import axiosClient from '../api/axiosClient';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { homeStyle } from '../Components/Navbar';

// Renamed component to ServiceForm for clarity
const ServiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // 👈 Get the ID from the URL (only present in edit mode)
    const isEditMode = !!id; // Boolean flag: true if editing, false if adding
    
    // State for initial data loading in edit mode
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    
    // State for form data
    const [formData, setFormData] = useState({ // Renamed useFormData to setFormData for standard convention
        name: '',
        Price: '',
        duration_minutes: '',
    });
    const [coverImg, setCoverImg] = useState(null); // Used for new file selection
    const [currentCoverImgUrl, setCurrentCoverImgUrl] = useState(''); // Used to display existing image
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch data when in Edit Mode
    useEffect(() => {
        if (isEditMode) {
            const fetchService = async () => {
                try {
                    // Fetch service details for the specific ID
                    const res = await axiosClient.get(`/services/editing/${id}`);
                    const serviceData = res.data[0]; 

                    console.log('Fetched service data for editing:', serviceData);

                    // Set formData with existing service details
                    setFormData({
                        name: serviceData.name,
                        Price: serviceData.Price,
                        duration_minutes: serviceData.duration_minutes,
                    });
                    // Store the URL of the existing cover image
                    setCurrentCoverImgUrl(serviceData.coverImg); 
                } catch (err) {
                    console.error('Error fetching service:', err);
                    setError('Could not load service details for editing.');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchService();
        }
    }, [id, isEditMode]);

    // Handle text input changed
    const handleChange = (e) => {
        setFormData({ // Use the standard setFormData
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setCoverImg(e.target.files[0]);
    };

    // 2. Dynamic Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if(!formData.name || !formData.Price || !formData.duration_minutes) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // In Add mode, coverImg is required. In Edit mode, it's optional.
        if (!isEditMode && !coverImg) {
            setError("Please select a cover image for the new service.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('Price', formData.Price);
        data.append('duration_minutes', formData.duration_minutes);

        // Only append the coverImg if a NEW file was selected
        if (coverImg) {
            data.append('coverImg', coverImg);
        }

        try {
            let res;
            if (isEditMode) {
                // If ID exists, use PUT method for UPDATE
                res = await axiosClient.put(`/services/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }, 
                });
                alert('Service updated successfully!');
            } else {
                // Otherwise, use POST method for CREATE
                res = await axiosClient.post('/services/add', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }, 
                });
                alert('Service created successfully!');
            }
            
            console.log('Operation successful:', res.data);
            
            // Determine the ID for navigation (new ID from POST, or existing ID from PUT)
            const serviceIdToNavigate = isEditMode ? id : res.data.service.id;
            
            navigate(`/services/${serviceIdToNavigate}`);

        } catch (err) {
            console.error('Error submitting service:', err.response?.data || err);
            setError(`Failed to ${isEditMode ? 'update' : 'create'} service. Please try again.`);
        } finally {
            setLoading(false);
        }
    };
    
    if (initialLoading) return <div className="text-center my-5">Loading service details...</div>;


    return (
        <div style={homeStyle}>
            
            <div className='form-control' style={{ maxWidth: "600px", margin: "auto", padding: "30px" }} >
                <h3 style={{paddingBottom: "30px"}}>
                    {isEditMode ? `Edit Service: ${formData.name}` : 'Add New Service'}
                </h3> {/* Dynamic Title */}

                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    {/* ... (Form Groups for Name, Price, Duration - No changes needed here) ... */}
                    <div style={{ marginBottom: "10px" }}>
                        <Form.Group as={Row} className="mb-2" controlId="formServiceName">
                            <Form.Label column sm="2">Name:</Form.Label>
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
                        <Form.Group as={Row} className="mb-2" controlId="formServicePrice">
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
                        <Form.Group as={Row} className="mb-2" controlId="formServiceDuration">
                            <Form.Label column sm="2">Duration:</Form.Label>
                            <Col sm="10">
                                <Form.Control 
                                    type="number"
                                    name="duration_minutes"
                                    placeholder='60 = 1 hour'
                                    value={formData.duration_minutes}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                    </div>

                    {/* Cover Image Input - Required attribute removed for edit mode */}
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Group as={Row} className="mb-2" controlId="formFileMultiple">
                        <Form.Label column sm="2">Cover:</Form.Label>
                        <Col sm="10">
                          <Form.Control 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            required={!isEditMode && !currentCoverImgUrl} // Only required if adding, OR if editing but no current image exists
                          />
                          {isEditMode && <Form.Text className="text-muted">Upload a new file to replace the current cover image.</Form.Text>}
                        </Col>
                      </Form.Group>
                    </div>

                    {/* Image Preview - Shows either new selected file or current existing file */}
                    {(coverImg || currentCoverImgUrl) && (
                        <div style={{ marginBottom: "10px" }}>
                          <img
                            src={coverImg ? URL.createObjectURL(coverImg) : currentCoverImgUrl} // Priority: New File > Current URL
                            alt="Preview"
                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                          />
                        </div>
                    )}

                    <button style={{ marginTop: "10px" }} className='btn btn-success' type="submit" disabled={loading}>
                        {loading 
                            ? (isEditMode ? "Updating..." : "Saving...") 
                            : (isEditMode ? "Update Service" : "Add Service")
                        } {/* Dynamic Button Text */}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ServiceForm; 

// Export the renamed component

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import { homeStyle } from '../Components/Navbar';

// const AddNewService = () => {
//     const navigate = useNavigate();
//     const [formData, useFormData] = useState({
//         name: '',
//         Price: '',
//         duration_minutes: '',
//     });
//     const [coverImg, setCoverImg] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     //Handle text input changed
//     const handleChange = (e) => {
//         useFormData({ 
//             ...formData, 
//             [e.target.name]: e.target.value 
//         });
//     };

//     //Handle file input changes
//     const handleFileChange = (e) => {
//         setCoverImg(e.target.files[0]);
//     };

//     //Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         if(!formData.name || !formData.Price || !formData.duration_minutes) {
//             setError("Please fill in all required fields.");
//             setLoading(false);
//             return;
//         }

//         if(!coverImg) {
//             setError("Please select a cover image.");
//             setLoading(false);
//             return;
//         }

//         const data = new FormData();
//         data.append('name', formData.name);
//         data.append('Price', formData.Price);
//         data.append('duration_minutes', formData.duration_minutes);

//         data.append('coverImg', coverImg);
//         try {
//             const res = await axiosClient.post('/services/add', data, {
//                 headers: { 'Content-Type': 'multipart/form-data' }, 
//             });
           
//             console.log('Service created:', res.data);
           
//            // ✅ FIX: Access the ID inside the 'service' object
//             const newServiceId = res.data.service.id; 
            
//             // Use the correctly retrieved ID for navigation
//             navigate(`/services/${newServiceId}`);

//         } catch (err) {
//             console.error('Error creating service:', err);
//             setError('Failed to create service. Please try again.');
//         } finally {
//         setLoading(false);
//         }
//     };

// return (
//     <div style={homeStyle}>
    
//     <div className='form-control' style={{ maxWidth: "600px", margin: "auto", padding: "30px" }} >
//         <h3 style={{paddingBottom: "30px"}}>Add New Service</h3>

//         <form onSubmit={handleSubmit}>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <div style={{ marginBottom: "10px" }}>
//                 <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
//                     <Form.Label column sm="2">
//                     Name:
//                     </Form.Label>
//                     <Col sm="10">
//                     <Form.Control 
//                         type="text" 
//                         name="name"
//                         placeholder='Natural Look'
//                         value={formData.name}
//                         onChange={handleChange}
//                         required />
//                     </Col>
//                 </Form.Group> 
//         </div>
        
//         <div style={{ marginBottom: "10px" }}>
//             <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
//                 <Form.Label column sm="2">Price:</Form.Label>
//                 <Col sm="10">
//                 <Form.Control 
//                     type="number"
//                     name="Price"
//                     placeholder='500'
//                     value={formData.Price}
//                     onChange={handleChange}
//                     required
//                     />
//                 </Col>
//             </Form.Group>     
//         </div>

//         <div style={{ marginBottom: "10px" }}>
//             <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
//                 <Form.Label column sm="2">Duration:</Form.Label>
//                 <Col sm="10">
//                     <Form.Control 
//                         type="number"
//                         name="duration_minutes"
//                         placeholder='60  = 1 hour'
//                         value={formData.duration_minutes}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Col>
//             </Form.Group>
//         </div>

//         <div style={{ marginBottom: "10px" }}>
//           <Form.Group as={Row} className="mb-2" controlId="formFileMultiple">
//             <Form.Label column sm="2">Cover:</Form.Label>
//             <Col sm="10">
//             <Form.Control 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleFileChange} required  />
//             </Col>
//           </Form.Group>
//         </div>

//         {coverImg && (
//           <div style={{ marginBottom: "10px" }}>
//             <img
//               src={URL.createObjectURL(coverImg)}
//               alt="Preview"
//               style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
//             />
//           </div>
//         )}

//         <button style={{ marginTop: "10px" }} className='btn btn-success' type="submit" disabled={loading}>
//           {loading ? "Saving..." : "Add Service"}
//         </button>
//         </form>
//     </div>
//     </div>
//   )
// }

// export default AddNewService