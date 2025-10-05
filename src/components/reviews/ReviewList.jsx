import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination } from 'react-bootstrap';
import Rating from 'react-rating-stars-component';
import { getProductReviews, getProductRating } from '../../services/ProductFeatureService';
import { formatDate } from '../../services/helper.service';

const ReviewList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadReviews();
        loadAverageRating();
    }, [productId, currentPage]);

    const loadReviews = async () => {
        try {
            const response = await getProductReviews(productId, currentPage);
            setReviews(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    };

    const loadAverageRating = async () => {
        try {
            const rating = await getProductRating(productId);
            setAverageRating(rating);
        } catch (error) {
            console.error('Error loading average rating:', error);
        }
    };

    return (
        <div>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Product Reviews</Card.Title>
                    <div className="mb-3">
                        <h5>Average Rating</h5>
                        <Rating
                            count={5}
                            value={averageRating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <span className="ms-2">({averageRating.toFixed(1)})</span>
                    </div>

                    {reviews.map((review) => (
                        <Card key={review.id} className="mb-2">
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <Rating
                                            count={5}
                                            value={review.rating}
                                            edit={false}
                                            size={20}
                                            activeColor="#ffd700"
                                        />
                                        <p className="mt-2">{review.comment}</p>
                                    </Col>
                                    <Col md={4} className="text-end">
                                        <small className="text-muted">
                                            By {review.user.name}
                                        </small>
                                        <br />
                                        <small className="text-muted">
                                            {formatDate(review.reviewDate)}
                                        </small>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center mt-3">
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index}
                                    active={index === currentPage}
                                    onClick={() => setCurrentPage(index)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReviewList;