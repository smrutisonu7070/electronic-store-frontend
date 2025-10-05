import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, isProductInWishlist } from '../../services/WishlistService.js';
import { getWishlistSections, createWishlistSection } from '../../services/WishlistSectionService.js';
import UserContext from '../../context/UserContext';

const WishlistButton = ({ productId, onWishlistChange }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [sections, setSections] = useState([]);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const { userData, isLogin } = useContext(UserContext);

    useEffect(() => {
        if (isLogin && userData?.user) {
            checkWishlistStatus();
            loadSections();
        }
    }, [productId, userData]);

    const loadSections = async () => {
        try {
            const data = await getWishlistSections(userData.user.userId);
            setSections(data);
        } catch (error) {
            console.error('Error loading wishlist sections:', error);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const status = await isProductInWishlist(userData.user.userId, productId);
            setIsInWishlist(status);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const handleWishlistClick = () => {
        if (!isLogin) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        if (isInWishlist) {
            handleRemoveFromWishlist();
        } else {
            setShowSectionModal(true);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            await removeFromWishlist(userData.user.userId, productId);
            toast.success('Removed from wishlist');
            setIsInWishlist(false);
            if (onWishlistChange) {
                onWishlistChange();
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddToWishlist = async (sectionId) => {
        try {
            await addToWishlist(userData.user.userId, productId, sectionId);
            toast.success('Added to wishlist');
            setIsInWishlist(true);
            if (onWishlistChange) {
                onWishlistChange();
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Failed to add to wishlist');
        } finally {
            setShowSectionModal(false);
        }
    };

    const [newSectionName, setNewSectionName] = useState('');
    
    const handleCreateSection = async () => {
        try {
            const newSection = await createWishlistSection(userData.user.userId, {
                name: newSectionName,
                description: ''
            });
            setSections([...sections, newSection]);
            setNewSectionName('');
            toast.success('Section created successfully');
        } catch (error) {
            console.error('Error creating section:', error);
            toast.error('Failed to create section');
        }
    };

    return (
        <>
            <Button 
                variant={isInWishlist ? "danger" : "outline-danger"}
                onClick={handleWishlistClick}
                className="ms-2"
            >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </Button>

            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add to Wishlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Choose a section:</h6>
                    <div className="mb-3">
                        <Button 
                            variant="outline-primary" 
                            className="mb-2 w-100"
                            onClick={() => handleAddToWishlist(null)}
                        >
                            Add to Default Wishlist
                        </Button>
                        {sections.map(section => (
                            <Button
                                key={section.id}
                                variant="outline-secondary"
                                className="mb-2 w-100"
                                onClick={() => handleAddToWishlist(section.id)}
                            >
                                {section.name}
                            </Button>
                        ))}
                    </div>
                    
                    <hr />
                    
                    <h6>Or create a new section:</h6>
                    <Form className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Enter section name"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="me-2"
                        />
                        <Button 
                            variant="primary"
                            onClick={handleCreateSection}
                            disabled={!newSectionName.trim()}
                        >
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default WishlistButton;