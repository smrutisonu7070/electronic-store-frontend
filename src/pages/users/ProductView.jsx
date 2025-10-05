import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ShowHtml from '../../components/ShowHtml'
import { getProductImageUrl } from '../../services/helper.service'
import { getProduct } from '../../services/product.service'
import defaultProductImage from '../../assets/default_product_image.jpg'
import { useContext } from 'react'
import { subscribeToStockNotification, unsubscribeFromStockNotification } from '../../services/StockNotificationService'
import CartContext from '../../context/CartContext'
import UserContext from '../../context/UserContext'
import ReviewList from '../../components/reviews/ReviewList'
import AddReview from '../../components/reviews/AddReview'
import WishlistButton from '../../components/wishlist/WishlistButton'
import ProductRecommendations from '../../components/recommendations/ProductRecommendations'
import { toast } from 'react-toastify'
function ProductView() {

    const { cart, addItem } = useContext(CartContext)
    const { isLogin, userData } = useContext(UserContext)
    const [product, setProduct] = useState(null)
    const { productId } = useParams()
    const [reviewAdded, setReviewAdded] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {

        loadUser(productId)

    }, [])


    const loadUser = (productdId) => {
        getProduct(productId).then(data => setProduct(data)).catch(error => console.log(error))
    }

    const handleAddItem = (productId, quantity) => {
        //if the product is in stock 
        addItem(quantity, productId, () => {
            toast.success("Product is added to cart")
        })
    }

    const handleNotificationSubscription = () => {
        if (!isLogin) {
            toast.error("Please login to subscribe to notifications")
            return
        }

        if (isSubscribed) {
            unsubscribeFromStockNotification(userData.user.userId, productId)
                .then(response => {
                    setIsSubscribed(false)
                    toast.success("Unsubscribed from stock notifications")
                })
                .catch(error => {
                    console.log(error)
                    toast.error("Error unsubscribing from notifications")
                })
        } else {
            subscribeToStockNotification(userData.user.userId, productId)
                .then(response => {
                    setIsSubscribed(true)
                    toast.success("Subscribed to stock notifications")
                })
                .catch(error => {
                    console.log(error)
                    toast.error("Error subscribing to notifications")
                })
        }
    }

    const handleReviewAdded = () => {
        setReviewAdded(!reviewAdded)
        loadUser(productId)
    }

    const productView = () => {
        return (
            <Container className='py-4'>
                <Row>
                    <Col md={8}>

                        <Card className='mt-4 border border-0 shadow-sm'>

                            <Card.Body>
                                <Container className='my-4'>
                                    <Row>
                                        <Col>
                                            <img
                                                style={{ width: " 500px " }}
                                                src={getProductImageUrl(product.productId)} alt=""
                                                onError={(event) => {
                                                    event.currentTarget.setAttribute('src', defaultProductImage)
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <h3>{product.title}</h3>
                                            <div className='text-muted product-description'>
                                                <ShowHtml htmlText={product.description} />
                                            </div>
                                            <Badge pill bg='info'>{product.category?.title}</Badge>
                                            <Badge className='ms-2' pill bg={product.stock ? 'success' : 'danger'}>{product.stock ? 'In Stock' : " Out of Stock"}</Badge>
                                            <Container className='text-center'>
                                                <b><span className='h1 text-muted'><s>₹{product.price}</s></span></b>
                                                <b><span className='h2  ms-2'>₹{product.discountedPrice}</span></b>
                                            </Container>
                                            <Container className='mt-4'>
                                                <div className='d-flex gap-2'>
                                                    <Button 
                                                        disabled={!product.stock} 
                                                        variant='warning' 
                                                        size={'sm'}
                                                        onClick={event => handleAddItem(product.productId, 1)}
                                                    >Add to Cart</Button>
                                                    <WishlistButton productId={product.productId} />
                                                    {!product.stock && (
                                                        <Button
                                                            variant={isSubscribed ? 'secondary' : 'info'}
                                                            size={'sm'}
                                                            onClick={handleNotificationSubscription}
                                                        >
                                                            {isSubscribed ? 'Unsubscribe from Stock Alerts' : 'Notify When Available'}
                                                        </Button>
                                                    )}
                                                </div>
                                                <Button as={Link} to='/store' className='mt-2' variant='info' size={'sm'}>Go to Store</Button>
                                            </Container>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>

                        </Card>

                        {/* Reviews Section */}
                        <Card className='mt-4 border border-0 shadow-sm'>
                            <Card.Body>
                                <div className='mt-4'>
                                    {isLogin && (
                                        <AddReview
                                            productId={productId}
                                            userId={userData.user.userId}
                                            onReviewAdded={handleReviewAdded}
                                        />
                                    )}
                                    <ReviewList productId={productId} />
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Recommendations Section */}
                        <Card className='mt-4 border border-0 shadow-sm'>
                            <Card.Body>
                                <ProductRecommendations
                                    productId={productId}
                                    type="similar"
                                />
                                {isLogin && (
                                    <ProductRecommendations
                                        userId={userData.user.userId}
                                        type="recommended"
                                    />
                                )}
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        product && productView()
    )
}

export default ProductView