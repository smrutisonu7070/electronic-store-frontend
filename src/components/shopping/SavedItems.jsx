import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
    getSavedItems,
    moveToCart,
    moveToWishlist,
    removeSavedItem
} from '../../services/ShoppingFeatureService';
import UserContext from '../../context/UserContext';
import CartContext from '../../context/CartContext';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../services/helper.service';
import { Link } from 'react-router-dom';

const SavedItems = () => {
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLogin, userData } = useContext(UserContext);
    const { cart, setCart } = useContext(CartContext);

    useEffect(() => {
        if (isLogin) {
            loadSavedItems();
        }
    }, [isLogin]);

    const loadSavedItems = async () => {
        try {
            const data = await getSavedItems(userData.user.userId);
            setSavedItems(data);
        } catch (error) {
            console.error('Error loading saved items:', error);
            toast.error('Failed to load saved items');
        } finally {
            setLoading(false);
        }
    };

    const handleMoveToCart = async (itemId) => {
        try {
            await moveToCart(userData.user.userId, itemId);
            toast.success('Item moved to cart');
            loadSavedItems();
            // Refresh cart
            if (cart) {
                setCart({ ...cart });
            }
        } catch (error) {
            console.error('Error moving item to cart:', error);
            toast.error('Failed to move item to cart');
        }
    };

    const handleMoveToWishlist = async (itemId) => {
        try {
            await moveToWishlist(userData.user.userId, itemId);
            toast.success('Item moved to wishlist');
            loadSavedItems();
        } catch (error) {
            console.error('Error moving item to wishlist:', error);
            toast.error('Failed to move item to wishlist');
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeSavedItem(userData.user.userId, itemId);
            toast.success('Item removed from saved items');
            loadSavedItems();
        } catch (error) {
            console.error('Error removing saved item:', error);
            toast.error('Failed to remove item');
        }
    };

    if (!isLogin) {
        return (
            <Container>
                <p>Please login to view your saved items.</p>
            </Container>
        );
    }

    if (loading) {
        return <div>Loading saved items...</div>;
    }

    return (
        <Container className="mt-3">
            <h2>Saved Items</h2>
            <Row>
                {savedItems.map(item => (
                    <Col md={4} key={item.id} className="mb-3">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={getProductImageUrl(item.product.productId)}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{item.product.title}</Card.Title>
                                <Card.Text>
                                    Price: ${item.product.price}
                                    <br />
                                    Quantity: {item.quantity}
                                </Card.Text>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMoveToCart(item.id)}
                                    >
                                        Move to Cart
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleMoveToWishlist(item.id)}
                                    >
                                        Move to Wishlist
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {savedItems.length === 0 && (
                    <Col>
                        <p>No items saved for later.</p>
                        <Link to="/store" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default SavedItems;