import Base from "../components/Base";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  return (
    <Base 
      title="Contact Us" 
      description="Get in touch with our expert support team"
    >
      <div className="contact-section">
        <Container>
          <h1 className="text-center contact-heading">Get In Touch</h1>
          <p className="text-center lead mb-5">We're here to help and answer any question you might have.</p>
          
          <Row className="g-4">
            <Col lg={4}>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h4>Call Us</h4>
                <p>+1 234 567 890</p>
                <p>Monday - Friday, 9am - 6pm</p>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h4>Email Us</h4>
                <p>support@electrostore.com</p>
                <p>We'll respond within 24 hours</p>
              </div>
            </Col>
            
            <Col lg={4}>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Visit Us</h4>
                <p>123 Tech Street</p>
                <p>Digital City, ST 12345</p>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col lg={6}>
              <div className="contact-info-card">
                <h3 className="mb-4">Business Hours</h3>
                <div className="business-hours">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="message-form">
                <h3 className="mb-4">Send us a Message</h3>
                <Form>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formSubject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="What is this regarding?" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="Your message" />
                  </Form.Group>

                  <Button className="send-button w-100" type="submit">
                    Send Message <i className="fas fa-paper-plane ms-2"></i>
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Base>
  );
};
export default Contact;
