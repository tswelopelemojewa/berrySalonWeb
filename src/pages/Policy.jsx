import React from 'react'

function Policy() {
  return (
     <div className="shadow rounded-4"
        style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <h4>Berry's Beauty Salon Customer Policy</h4><br />

       
        <p>1. A non refundable deposit of 50% secures your appointment. <strong>Please use your phone number as reference.</strong> KINDLY NOTE: NO BOOKING FEE NO APPOINTMENT!</p>
        <p>2. Appointment reschedule is allowed <strong>10hrs before your appointment</strong>, failure to do so,your appointment is automatically cancelled and the deposit will be forfeited</p>
        <p>3. <strong>Please Attend appointments alone to ensure confidentiality and personalised service</strong></p>
        {/* <p>4. <strong>Kindly note that lateness penalty applies.
               - More than 10 minutes late → R50 fee applies
              - 20 minutes late → Appointment cancelled, no refund of deposit</strong></p> */}
        <p>4. <strong>Please note that arriving late may affect the quality of your service, as I will need to rush. Appointments with a delay of 20 minutes or more will be cancelled, and the deposit will not be refunded.</strong></p>
        <p>5. I don't accept ewallet and cash send, if you're transferring please make it an immediate payment</p>

        <br />
        
        <h5>
            THANK YOU SO MUCH FOR YOUR UNDERSTANDING AND SUPPORT! IF YOU HAVE ANY QUESTIONS FEEL FREE TO REACH OUT.
        </h5>
        <br />
        
        <ul>
            <h5><strong>BANKING DETAILS</strong></h5>
            <p><strong>Bank: Capitec</strong></p>
            <p><strong>Acc no: 1327703457</strong></p>
            <p><strong>Cell no: 0661278895</strong></p>
            <p><strong>Acc holder: Ms K Kgatle</strong></p>
        </ul>
        <br />
    </div>
    
  )
}

export default Policy