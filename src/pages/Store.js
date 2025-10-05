import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import Base from "../components/Base";
import './Store.css';
import '../styles/GlobalStyles.css';

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter products based on category
  const filteredProducts = products.filter(product => 
    filterCategory === 'all' || product.category.toLowerCase() === filterCategory.toLowerCase()
  );

  // Simulated products data
  useEffect(() => {
    // TODO: Replace with actual API call
    const dummyProducts = [
      {
        id: 1,
        name: "Premium Smartphone Pro Max",
        price: 54999,
        discountedPrice: 49999,
        category: "Smartphones",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
        rating: 4.5,
        stock: 15
      },
      {
        id: 2,
        name: "Ultra-Slim Laptop X1",
        price: 89999,
        discountedPrice: 79999,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        rating: 4.8,
        stock: 10
      },
      {
        id: 3,
        name: "Wireless Noise-Canceling Headphones",
        price: 24999,
        discountedPrice: 19999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating: 4.3,
        stock: 25
      },
      {
        id: 4,
        name: "4K Smart TV 55-inch",
        price: 69999,
        discountedPrice: 59999,
        category: "TV & Audio",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
        rating: 4.6,
        stock: 8
      },
      {
        id: 5,
        name: "Designer Watch Collection",
        price: 12999,
        discountedPrice: 9999,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating: 4.7,
        stock: 20
      },
      {
        id: 6,
        name: "Premium Leather Wallet",
        price: 2999,
        discountedPrice: 2499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
        rating: 4.4,
        stock: 30
      },
      {
        id: 7,
        name: "Smart Fitness Band",
        price: 4999,
        discountedPrice: 3999,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8",
        rating: 4.5,
        stock: 25
      }
    ];
    
    setProducts(dummyProducts);
    setLoading(false);
  }, []);

  return (
    <Base
      title="Electronic Store"
      description="Discover our wide range of electronic products"
    >
      <Container className="store-section">
        <div className="category-filter">
          <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sort by</Form.Label>
              <Form.Select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="custom-form-control"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filter by Category</Form.Label>
              <Form.Select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="custom-form-control"
              >
                <option value="all">All Categories</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="accessories">Accessories</option>
                <option value="fashion">Fashion</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        </div>

        <Row className="g-4">
          {loading ? (
            [...Array(8)].map((_, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card className="custom-card loading-skeleton" style={{ height: "300px" }}></Card>
              </Col>
            ))
          ) : (
            filteredProducts.map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="custom-card">
                  <div className="image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Badge className="category-badge">{product.category}</Badge>
                    {product.discountedPrice && (
                      <span className="discount-badge">
                        {Math.round((1 - product.discountedPrice/product.price) * 100)}% OFF
                      </span>
                    )}
                    <div className="overlay">
                      <Button variant="light" className="custom-button">View Details</Button>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="product-title">{product.name}</Card.Title>
                    <div className="price-rating-container">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="price-container">
                          <span className="discounted-price">₹{product.discountedPrice?.toLocaleString()}</span>
                          {product.discountedPrice && (
                            <span className="original-price">₹{product.price?.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="rating-container">
                          <i className="fas fa-star text-warning"></i>
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <div className="stock-status">
                        <small className={`text-${product.stock > 10 ? 'success' : 'danger'}`}>
                          {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        </Container>
      </Base>
    );
}

export default Store;
