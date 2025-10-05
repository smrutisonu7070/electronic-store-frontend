import {
  Col,
  Container,
  Row,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SingleProductCard from "../components/users/SingleProductCard";

export const trendingProducts = (products) => {
  return (
    <Container>
      <Row>
        <h3 className="text-center mb-4">Trending Products</h3>
        {products.map((product) => (
          <Col md={4} key={product.productId} className="mb-4">
            <SingleProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export const infoWithImageInRightSection = (image, title, text, buttonText = "Learn More", buttonLink = "/store") => {
  return (
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
          <div>
            <h3 className="fw-bold mb-3">{title}</h3>
            <p className="lead mb-4">{text}</p>
            <Link to={buttonLink}>
              <Button variant="primary" size="lg" className="rounded-pill px-4">
                {buttonText} <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Link>
          </div>
        </Col>
        <Col md={6} className="text-center">
          <img 
            src={image} 
            alt={title}
            className="img-fluid rounded shadow-lg" 
            style={{ 
              maxWidth: '100%',
              height: 'auto',
              transition: 'transform 0.3s ease'
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export const infoWithImageInLeftSection = (image, title, text, buttonText = "Learn More", buttonLink = "/store") => {
  return (
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <img 
            src={image} 
            alt={title}
            className="img-fluid rounded shadow-lg" 
            style={{ 
              maxWidth: '100%',
              height: 'auto',
              transition: 'transform 0.3s ease'
            }}
          />
        </Col>
        <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
          <div>
            <h3 className="fw-bold mb-3">{title}</h3>
            <p className="lead mb-4">{text}</p>
            <Link to={buttonLink}>
              <Button variant="primary" size="lg" className="rounded-pill px-4">
                {buttonText} <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
