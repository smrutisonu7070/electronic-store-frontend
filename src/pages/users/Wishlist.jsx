import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Nav } from 'react-bootstrap';
import { getWishlist, removeFromWishlist } from '../../services/WishlistService.js';
import { getWishlistSections, deleteWishlistSection } from '../../services/WishlistSectionService.js';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { getProduct } from '../../services/product.service';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../services/helper.service';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const { isLogin, userData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        if (userData && userData.user) {
            loadWishlist();
            loadSections();
        }
    }, [userData]);

    const loadSections = async () => {
        try {
            const data = await getWishlistSections(userData.user.userId);
            setSections(data);
        } catch (error) {
            console.error('Error loading sections:', error);
            toast.error('Error loading wishlist sections');
        }
    };

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const wishlistResponse = await getWishlist(userData.user.userId, activeSection?.id);
            console.log('Wishlist Response:', wishlistResponse);
            
            // Fetch product details for each wishlist item
            const productsPromises = wishlistResponse.map(item => 
                getProduct(item.productId).then(product => ({
                    ...product,
                    sectionId: item.sectionId,
                    sectionName: item.sectionName
                }))
            );
            
            const products = await Promise.all(productsPromises);
            setWishlistItems(products);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Error loading wishlist");
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            setRemovingId(productId);
            await removeFromWishlist(userData.user.userId, productId);
            toast.success('Item removed from wishlist');
            // Remove item locally to avoid full reload
            setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
            toast.error(error.message || 'Failed to remove item from wishlist');
        } finally {
            setRemovingId(null);
        }
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
        loadWishlist();
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteWishlistSection(userData.user.userId, sectionId);
            toast.success('Section deleted successfully');
            loadSections();
            if (activeSection?.id === sectionId) {
                setActiveSection(null);
            }
            loadWishlist();
        } catch (error) {
            console.error('Error deleting section:', error);
            toast.error('Failed to delete section');
        }
    };

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <Card className="border-0 shadow mt-3">
                        <Card.Body>
                            <h5>Wishlist Sections</h5>
                            <Nav className="flex-column">
                                <Nav.Link
                                    className={`mb-2 ${!activeSection ? 'active' : ''}`}
                                    onClick={() => handleSectionClick(null)}
                                >
                                    All Items
                                </Nav.Link>
                                {sections.map(section => (
                                    <div key={section.id} className="d-flex align-items-center mb-2">
                                        <Nav.Link
                                            className={`flex-grow-1 ${activeSection?.id === section.id ? 'active' : ''}`}
                                            onClick={() => handleSectionClick(section)}
                                        >
                                            {section.name}
                                        </Nav.Link>
                                        <Button
                                            variant="link"
                                            className="text-danger p-0 ms-2"
                                            onClick={() => handleDeleteSection(section.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                ))}
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card className="border-0 shadow mt-3">
                        <Card.Body>
                            <h3>
                                {activeSection ? `${activeSection.name}` : 'My Wishlist'}
                            </h3>
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Loading your wishlist...</p>
                                </div>
                            ) : (
                                <Row className="mt-4">
                                    {wishlistItems && wishlistItems.length > 0 ? (
                                        wishlistItems.map(item => (
                                            <Col key={item.productId} md={4} className="mb-4">
                                                <Card className="h-100 shadow-sm">
                                                    <div className="position-relative">
                                                        <Card.Img 
                                                            variant="top" 
                                                            src={getProductImageUrl(item.productId)} 
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        {item.stock && item.discountedPrice < item.price && (
                                                            <span className="position-absolute top-0 end-0 badge bg-success m-2">
                                                                {Math.round((1 - item.discountedPrice/item.price) * 100)}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Card.Body className="d-flex flex-column">
                                                        <Card.Title style={{fontSize: '1rem'}}>{item.title}</Card.Title>
                                                        <Card.Text className="mt-2">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <span className="text-muted"><s>₹{item.price}</s></span>
                                                                    <span className="ms-2 fw-bold text-success">₹{item.discountedPrice}</span>
                                                                </div>
                                                                {!item.stock && <span className="badge bg-danger">Out of Stock</span>}
                                                            </div>
                                                        </Card.Text>
                                                        <div className="d-flex gap-2 mt-auto">
                                                            <Link 
                                                                to={`/store/products/${item.productId}`} 
                                                                className="btn btn-primary flex-grow-1"
                                                            >
                                                                View Details
                                                            </Link>
                                                            <Button 
                                                                variant="outline-danger" 
                                                                onClick={() => handleRemoveFromWishlist(item.productId)}
                                                                disabled={removingId === item.productId}
                                                            >
                                                                {removingId === item.productId ? (
                                                                    <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <i className="bi bi-trash"></i>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col>
                                            <div className="text-center py-5">
                                                <i className="bi bi-heart" style={{fontSize: '2rem'}}></i>
                                                <h4 className="mt-3">Your wishlist is empty</h4>
                                                <p className="text-muted">Start adding items to your wishlist!</p>
                                                <Link to="/store" className="btn btn-primary">
                                                    Browse Products
                                                </Link>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Wishlist;