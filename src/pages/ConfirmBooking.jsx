import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import { React, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Policy from './Policy';
import { FaWhatsapp } from 'react-icons/fa';

const baseURL = 'https://berrysalon.onrender.com';

const ConfirmBooking = () => {
  const { state } = useLocation();
  const [services, setServices] = useState([]);
  const [agreed, setAgreed] = useState(false);


  // Safety check
  if (!state) return <p>No booking details found.</p>;

  const { name, user_number, serviceId, date, time } = state;

  useEffect(() => {
    axios.get(`${baseURL}/services`)
        .then(res => setServices(res.data))
        .catch(err => console.log(err));
  }, []);

  const selectedService = services.find(s => s.id === Number(serviceId));

  const serviceName = selectedService?.name || "";
  const servicePrice = selectedService?.Price || "";
  const deposit = selectedService?.Price * 0.5 || "";
  const serviceDuration = selectedService
    ? selectedService.duration_minutes >= 60
      ? `${Math.floor(selectedService.duration_minutes / 60)}h ${selectedService.duration_minutes % 60}m`
      : `${selectedService.duration_minutes} minutes`
    : "";





  function formatDateLong(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  
}


const formattedDate = formatDateLong(date);


  // Your WhatsApp number (the number you want clients to message)
  const businessNumber = "27661278895"; // 27 = SA country code

  // WhatsApp message template
  const message = `
Hello, I just booked an appointment:

👤 Name: ${name}
📞 Number: ${user_number}
💅🏽 Service: ${serviceName}
📅 Date: ${formattedDate}
⏰ Time: ${time}

Please confirm on your side before I pay the ${deposit} booking fee. Thank you!`;

  // Encode it for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL
  const whatsappLink = `https://wa.me/${businessNumber}?text=${encodedMessage}`;



  return (
  <div style={{ maxWidth: "750px", margin: "0 auto", padding: "25px" }}>

    <h2 style={{ paddingBottom: "10px", paddingTop: "20px", textAlign: "center" }}>
      Appointment Booked Successfully 🎉
    </h2>

    <p style={{ textAlign: "center", fontSize: "16px" }}>
      <strong>Please read the policy below before confirming your appointment.</strong>
    </p>

    {/* Policy Section */}
    <div
      style={{
        background: "#fff8e6",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #f1d49c",
        marginTop: "20px"
      }}
    >
      <Policy />
    </div>

    {/* Agreement Checkbox */}
    <div style={{ marginTop: "20px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>I have read and agree to the policy.</span>
      </label>
    </div>

    {/* Booking Details */}
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f8f9fb",
        borderRadius: "8px",
        border: "1px solid #e1e1e1"
      }}
    >
      <h4 style={{ marginBottom: "15px" }}>Booking Details</h4>

      <p><strong>Name:</strong> {name}</p>
      <p><strong>Contact Number:</strong> {user_number}</p>
      <p><strong>Service:</strong> {serviceName}</p>
      <p><strong>Price:</strong> R {servicePrice}</p>
      <p><strong>Deposit (50%):</strong> R {deposit}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Duration:</strong> {serviceDuration}</p>
    </div>

    {/* WhatsApp Confirmation Button */}
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <Button
        variant="success"
        href={agreed ? whatsappLink : undefined}
        disabled={!agreed}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          opacity: agreed ? 1 : 0.6,
          cursor: agreed ? "pointer" : "not-allowed",
        }}
      >
        <FaWhatsapp size={25} />
        Send Confirmation on WhatsApp
      </Button>
    </div>

  </div>
);

}

export default ConfirmBooking