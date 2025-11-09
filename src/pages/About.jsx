import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa'; // 👈 Import icons
import { Link } from 'react-router-dom';

const About = () => {
  return (
    // <Container
    //   fluid
    //   className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    // >
      <Card
        className="shadow rounded-4"
        style={{ width: '100%', maxWidth: '900px', backgroundColor: '#212529' }}
      >
        <Row>
          {/* Contact Information */}
          <Col
            md={12}
            className="text-light text-center p-4 rounded-4 d-flex flex-column justify-content-center"
          >
            <h3 className="fw-bold mb-4">Get in Touch</h3> <hr />

            <div className="mb-3 d-flex align-items-center justify-content-center">
              <FaMapMarkerAlt size={22} className="me-3" style={{color: "#e91e63"}} />
              <div>
                <Link 
                  to={'https://maps.app.goo.gl/JsECWxnkeGPeLXSw9'} 
                  className="text-decoration-none text-light">
                  Arcadia, Pretoria, South Africa
                </Link>
                
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center justify-content-center">
              <FaEnvelope size={22} className="me-3" style={{color: "#e91e63"}} />
              <div>

                <a
                  href="mailto:kgothatsokgatle11@gmail.com"
                  className="text-decoration-none text-light"
                >
                  kgothatsokgatle11@gmail.com
                </a>
              </div>
            </div>

            {/* <div className="mb-3 d-flex align-items-center justify-content-center">
              <FaPhoneAlt size={22} className="me-3" style={{color: "#e91e63"}} />
              <div>
                <strong>Phone</strong>
                <br />
                <a
                  href="tel:+27661278895"
                  className="text-decoration-none text-light"
                >
                  +27 66 127 8895
                </a>
              </div>
            </div> */}
            
            <div className="mb-3 d-flex align-items-center justify-content-center">
              <FaWhatsapp size={22} className="me-3 text-success" />
              <div>
                {/* <strong>WhatsApp</strong>
                <br /> */}
                <a
                  href="https://wa.me/27661278895" // 👈 Opens WhatsApp chat directly
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-light"
                >
                  +27 66 127 8895
                </a>
              </div>
            </div>

            <div className="mb-4 d-flex align-items-center justify-content-center">
              <FaTiktok size={22} className="me-3" style={{color: "#e91e63"}} />
              <div>
                {/* <strong>TikTok</strong>
                <br /> */}
                <Link
                  to="https://www.tiktok.com/@berrymua11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  @berrybeautysalon
                </Link>
              </div>
            </div>

            <p className="small text-muted text-center mt-auto">
              © {new Date().getFullYear()} Berry's Beauty Salon
            </p>
          </Col>
        </Row>
      </Card>
    // </Container>
  );
};

export default About;
