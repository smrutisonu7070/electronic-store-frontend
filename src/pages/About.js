import Base from "../components/Base";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/GlobalStyles.css";

function About() {
  return (
    <Base 
      title="About Electro Store" 
      description="Discover our story and commitment to excellence"
      buttonEnabled={true}
      buttonText="Visit Store"
      buttonLink="/store"
      buttonType="primary"
    >
      <Container className="page-section">
        <Row className="mb-5">
          <Col className="text-center">
            <div className="image-container mb-4">
              <img 
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&h=400&q=80"
                alt="Electronics Store Banner"
                className="img-fluid w-100"
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <div className="overlay">
                <h1 className="text-white display-4 fw-bold">Innovation Meets Excellence</h1>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="align-items-center g-4">
          <Col md={6} className="fade-in-up">
            <h2 className="section-title">Our Story</h2>
            <p className="lead mb-4">Your trusted destination for cutting-edge electronics since 2020.</p>
            <p className="mb-4">We've been at the forefront of technology retail, bringing the latest innovations to our customers. Our commitment to quality and customer satisfaction has made us a leader in the electronic retail industry.</p>
            
            <div className="custom-card p-4 mb-4">
              <h4 className="mb-3">Why Choose Us?</h4>
              <ul className="custom-list">
                <li className="custom-list-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Premium Quality Products
                </li>
                <li className="custom-list-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Competitive Market Prices
                </li>
                <li className="custom-list-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  24/7 Expert Support
                </li>
                <li className="custom-list-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Express Shipping
                </li>
                <li className="custom-list-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Secure Payment Options
                </li>
              </ul>
            </div>

            <div className="image-container">
              <img 
                src="https://images.unsplash.com/photo-1560438718-eb61ede255eb?auto=format&fit=crop&w=600&h=400&q=80"
                alt="Quality Products"
                className="img-fluid w-100"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="overlay">
                <span className="text-white h5">Quality Assured Products</span>
              </div>
            </div>
          </Col>

          <Col md={6} className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Card className="custom-card border-0">
              <div className="image-container">
                <Card.Img 
                  src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=600&h=300&q=80"
                  alt="Our Mission"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="overlay">
                  <span className="text-white h5">Our Mission</span>
                </div>
              </div>
              <Card.Body className="p-4">
                <h3 className="mb-3">Our Mission</h3>
                <p>To provide our customers with the latest technology solutions while ensuring the highest standards of service and support. We strive to make premium electronics accessible to everyone.</p>
                
                <h5 className="mt-4 mb-3">Our Values</h5>
                <div className="d-flex flex-column gap-3">
                  <div className="custom-list-item">
                    <i className="fas fa-star text-warning me-2"></i>
                    <strong>Excellence</strong> in everything we do
                  </div>
                  <div className="custom-list-item">
                    <i className="fas fa-handshake text-primary me-2"></i>
                    <strong>Trust</strong> and transparency
                  </div>
                  <div className="custom-list-item">
                    <i className="fas fa-heart text-danger me-2"></i>
                    <strong>Customer</strong> satisfaction first
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Base>
  );
}

export default About;
