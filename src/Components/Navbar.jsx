import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const baseURL = 'https://berrysalon.onrender.com'; 

export const backgroundImage = `${baseURL}/uploads/background.jpg`; // Your image import

export  const homeStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
    // backgroundImage: `url(${backgroundImage})`,
    backgroundColor: 'rgba(193, 186, 54, 0.53)', // Fallback color
    backgroundBlendMode: 'darken', // Blend mode
    backgroundSize: 'cover', // Ensure the image covers the entire div
    
  };

function Navigation() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Berry's Beauty Salon</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/Services">Services</Nav.Link>
              <Nav.Link href="/appointments">Appointments</Nav.Link>
              <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/admin/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      
    </>
  );
}

export default Navigation;