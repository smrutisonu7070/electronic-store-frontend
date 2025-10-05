import Base from "../components/Base";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Services.css";

function Services() {
  const services = [
    {
      icon: "fas fa-truck",
      title: "Fast Delivery",
      description: "Free shipping on orders over $100. Same-day delivery available in selected areas.",
      color: "#4CAF50",
      image: "https://img.freepik.com/free-vector/delivery-service-with-mask-concept_23-2148505104.jpg?w=600&h=400"
    },
    {
      icon: "fas fa-tools",
      title: "Expert Repair",
      description: "Professional repair services for all electronic devices with 90-day warranty.",
      color: "#2196F3",
      image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      icon: "fas fa-exchange-alt",
      title: "Easy Returns",
      description: "Hassle-free returns within 30 days. No questions asked return policy.",
      color: "#FF9800",
      image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      icon: "fas fa-headset",
      title: "24/7 Support",
      description: "Round-the-clock customer support via phone, email, and live chat.",
      color: "#E91E63",
      image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Extended Warranty",
      description: "Optional extended warranty coverage for up to 3 years on all products.",
      color: "#9C27B0",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      icon: "fas fa-cog",
      title: "Installation Service",
      description: "Professional installation and setup services for complex electronics.",
      color: "#607D8B",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&h=400&q=80"
    }
  ];

  return (
    <Base
      title="Our Services"
      description="Discover the premium services that set us apart"
      buttonEnabled={true}
      buttonLink="/"
      buttonType="primary"
      buttonText="Back to Home"
    >
      <Container className="py-5">
        {/* Featured Service */}
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-4">Why Choose Our Services?</h2>
          <p className="lead text-muted">
            We provide comprehensive solutions for all your electronic needs with expert care and premium support.
          </p>
        </div>

        {/* Services Grid */}
        <Row className="g-4">
          {services.map((service, index) => (
            <Col key={index} md={6} lg={4} className="service-card">
              <Card className="h-100 shadow-sm hover-lift">
                <div className="service-image-container">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-image w-100"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="service-overlay" style={{ backgroundColor: service.color + "95" }}></div>
                </div>
                <Card.Body className="text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: service.color + "15",
                      marginTop: "-55px",
                      position: "relative",
                      backgroundColor: "#fff",
                      border: `2px solid ${service.color}`
                    }}
                  >
                    <i 
                      className={`${service.icon} service-icon`}
                      style={{
                        fontSize: "1.75rem",
                        color: service.color
                      }}
                    ></i>
                  </div>
                  <h4 className="mb-3">{service.title}</h4>
                  <p className="text-muted mb-0">{service.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Additional Info */}
        <div className="mt-5 pt-5 border-top">
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h3 className="mb-4">Need Custom Services?</h3>
              <p className="text-muted">
                We understand that every customer has unique needs. Contact our support team to discuss custom service packages tailored to your requirements.
              </p>
              <Link to="/contact" className="btn btn-primary btn-lg btn-hover-scale">
                Contact Support <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </Col>
            <Col md={6}>
              <Card className="bg-light border-0">
                <Card.Body className="p-4">
                  <h5 className="mb-3">Service Hours</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="far fa-clock me-2 text-primary"></i>
                      Monday - Friday: 9:00 AM - 8:00 PM
                    </li>
                    <li className="mb-2">
                      <i className="far fa-clock me-2 text-primary"></i>
                      Saturday: 10:00 AM - 6:00 PM
                    </li>
                    <li>
                      <i className="far fa-clock me-2 text-primary"></i>
                      Sunday: 12:00 PM - 5:00 PM
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </Base>
  );
}

export default Services;
