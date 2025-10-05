import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { getRecommendedProducts, getSimilarProducts } from '../../services/ProductFeatureService';
import SingleProductCard from '../users/SingleProductCard';

const ProductRecommendations = ({ userId, productId, type = 'recommended' }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadRecommendations();
    }, [userId, productId, type]);

    const loadRecommendations = async () => {
        try {
            let response;
            if (type === 'recommended' && userId) {
                response = await getRecommendedProducts(userId);
            } else if (type === 'similar' && productId) {
                response = await getSimilarProducts(productId);
            }
            setProducts(response || []);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <Card className="mt-4">
            <Card.Body>
                <Card.Title>
                    {type === 'recommended' ? 'Recommended for You' : 'Similar Products'}
                </Card.Title>
                <Row xs={1} md={4} className="g-4">
                    {products.map(product => (
                        <Col key={product.productId}>
                            <SingleProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ProductRecommendations;