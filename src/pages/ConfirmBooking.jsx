import React from 'react'
import { Link } from 'react-router-dom'
import Policy from './Policy'

const ConfirmBooking = () => {
  return (
    <div>
        <h3 style={{paddingBottom: "30px"}}>Confirm Booking</h3>
        <p>Your booking has been submitted, Please read the below policy. We look forward to seeing you!</p> <br />
        <Policy />
        <br />

        <Link to="/" className="btn btn-primary" style={{padding: '10px'}}>Go to Home</Link>
    </div>
  )
}

export default ConfirmBooking