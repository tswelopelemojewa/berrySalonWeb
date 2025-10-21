import React from 'react';
// import '../app.css';
import Image from 'react-bootstrap/Image';
import Services from "./Services.jsx";

import { homeStyle } from '../Components/Navbar';
import { Link } from 'react-router-dom';

export function Home() {
  // Create a style object


  return (
    <>  
    // Apply the style to your main container
    <div  className="hero-section overlay"  style={homeStyle}>

        <div className="home-content" >
          <h1 className="services-title">Welcome to Berry's Beauty Salon</h1> <br/>
          {/* <h1 className="home-title">Welcome to Berry's Beauty Salon</h1> */}
          {/* <h2 className="home-subtitle">Your Beauty, Our Duty</h2> */}
          <p className="home-subtitle">
            Indulge in the art of beauty and relaxation — where every service is a touch of perfection.
          </p>
          {/* <img src={background2} alt="Salon" className="home-image" /> */}
          {/* <Image src="../assets/1321230.png" alt="Salon" className="home-image" roundedCircle /> */}
          <button className="book-btn">
            <Link to="/new/appointments" style={{ textDecoration: 'none', color: 'white' }}>
            Book an Appointment
            </Link>
            </button>
            
            
        </div>
       
      
    </div>
    {/* <br /> */}
    <div className="hero-section" style={{marginBlockStart: '600px'}} >
      <Services />
    </div>

    </>
  );
}

export default Home;