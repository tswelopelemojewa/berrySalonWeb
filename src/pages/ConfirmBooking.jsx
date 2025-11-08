import React from 'react'
import { Link } from 'react-router-dom'

const ConfirmBooking = () => {
  return (
    <div>
        <h3 style={{paddingBottom: "30px"}}>Confirm Booking</h3>
        <p>Your booking has been submitted, you will receive a whatsapp confirmation once you made the payment. We look forward to seeing you!</p>

        <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  )
}

export default ConfirmBooking