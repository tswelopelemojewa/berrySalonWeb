import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const baseURL = 'https://berrysalon.onrender.com';

const AddServicePicture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ selectedFiles, useSelectedFiles ] = useState([]);

  const handleFileChange = (e) => {
    useSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }


    // prepare the form data
    const formData = new FormData();
    // formData.append("images", file1);
    // formData.append("images", file2); 
    console.log('formData: ', formData)
    formData.append('service_id', id);

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }
    try {
      const res = await axios.post(`${baseURL}/services/${id}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("Received files:", req.files);
      // console.log("Params:", req.params);

      console.log('Upload successful:', res.data);
      //alert('Images uploaded successfully!');
      useSelectedFiles([]);
      navigate(`/services/${id}`);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    }
  };


  return (
    <div>
      <h3>Upload Images</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default AddServicePicture