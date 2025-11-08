import React from 'react'
import backgroundImage from '../assets/background.jpg'; // Your image import


const About = () => {
  // Create a style object
  const homeStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  return (
    <div className='fluid-container' style={homeStyle}>
      <h1>About</h1>
      <p>This is the about page</p>
    </div>

  )
}

export default About