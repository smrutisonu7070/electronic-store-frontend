import React from 'react'
import { Badge, Button, Card, Container } from 'react-bootstrap'
import { getProductImageUrl } from '../../services/helper.service'
import "../users/SingleProductCard.css"
import defaultProductImage from '../../assets/default_product_image.jpg'
import { Link } from 'react-router-dom'
const SingleProductCard = ({ product }) => {
    return (

        <Card className='m-1 shadow-sm'>

            <Card.Body>
                <Container className='text-center'>
                    <img
                        src={getProductImageUrl(product.productId)}
                        className="product-image"
                        onError={event => {
                            event.currentTarget.setAttribute('src', defaultProductImage)
                        }}
                        alt="" />
                </Container>
                <h6>{product.title}</h6>
                <p className='text-muted'>{product.description}</p>
                <Badge pill bg='info'>{product.category?.title}</Badge>
                {product.quantity > 0 ? (
                    <Badge className='ms-2' pill bg={product.quantity > 10 ? 'success' : 'warning'}>
                        {product.quantity > 10 ? 'In Stock' : `Only ${product.quantity} left`}
                    </Badge>
                ) : (
                    <Badge className='ms-2' pill bg='danger'>Out of Stock</Badge>
                )}
                <Container className='text-end'>
                    <b><span className='h3 text-muted'><s>₹{product.price}</s></span></b>
                    <b><span className='h4  ms-2'>₹{product.discountedPrice}</span></b>
                </Container>
                <Container className='d-grid mt-4'>
                    <Button 
                        as={Link} 
                        to={`/store/products/${product.productId}`} 
                        variant={product.quantity > 0 ? 'success' : 'secondary'} 
                        size={'sm'}
                    >
                        {product.quantity > 0 ? 'View Product' : 'Out of Stock'}
                    </Button>
                    {product.quantity === 0 && (
                        <small className='text-muted text-center mt-2'>
                            Subscribe for stock notifications on product page
                        </small>
                    )}
                </Container>
            </Card.Body>
        </Card>
    )
}

export default SingleProductCard