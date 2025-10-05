import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import Rating from 'react-rating-stars-component';
import { toast } from 'react-toastify';
import { createProductReview } from '../../services/ProductFeatureService';

const AddReview = ({ productId, userId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            const reviewData = {
                rating: rating,
                comment: comment,
                userId: userId,
                productId: productId
            };
            await createProductReview(productId, reviewData);
            toast.success('Review added successfully');
            setRating(0);
            setComment('');
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error('Error adding review:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add review';
            toast.error(errorMessage);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Write a Review</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Rating
                            count={5}
                            value={rating}
                            onChange={(newRating) => setRating(newRating)}
                            size={24}
                            activeColor="#ffd700"
                        />
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review here..."
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit Review
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddReview;