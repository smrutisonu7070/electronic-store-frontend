import React, { useContext, useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Badge, ProgressBar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateOroder } from '../../services/OrderService';
import Base from '../../components/Base';
import './PaymentPage.css';

// Test card for development
const TEST_CARD = {
    number: '4111111111111111',
    name: 'Test User',
    expiry: '12/25',
    cvv: '123'
};

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;
    
    const [selectedPayment, setSelectedPayment] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
        netBankingBank: '',
        walletType: '',
        emiMonths: '',
        emiBank: ''
    });
    const [errors, setErrors] = useState({});
    const [saveCard, setSaveCard] = useState(false);

    useEffect(() => {
        if (!orderData) {
            toast.error("No order data found!");
            navigate("/cart");
            return;
        }
    }, [orderData, navigate]);

    // Payment methods configuration
    const paymentMethods = [
        { id: 'card', icon: 'fa-credit-card', name: 'Credit/Debit Card', description: 'Pay securely with your card' },
        { id: 'upi', icon: 'fa-mobile-alt', name: 'UPI', description: 'Pay using UPI apps' },
        { id: 'netbanking', icon: 'fa-university', name: 'Net Banking', description: 'Pay through your bank account' },
        { id: 'wallet', icon: 'fa-wallet', name: 'Digital Wallet', description: 'Pay using digital wallets' },
        { id: 'emi', icon: 'fa-clock', name: 'EMI', description: 'Pay in easy installments' },
        { id: 'cod', icon: 'fa-money-bill', name: 'Cash on Delivery', description: 'Pay when you receive' }
    ];

    const banks = [
        'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'
    ];

    const wallets = [
        'Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay', 'MobiKwik'
    ];

    const emiOptions = [3, 6, 9, 12, 18, 24];

    const handlePaymentMethodChange = (method) => {
        setSelectedPayment(method);
    };

    const fillTestCard = () => {
        setPaymentDetails({
            ...paymentDetails,
            cardNumber: TEST_CARD.number,
            cardHolderName: TEST_CARD.name,
            expiryDate: TEST_CARD.expiry,
            cvv: TEST_CARD.cvv
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        }
        // Format expiry date with slash
        else if (name === 'expiryDate') {
            formattedValue = value.replace(/\s/g, '')
                .replace(/^([0-9]{2})([0-9]{2})$/g, '$1/$2')
                .replace(/\/\//g, '/');
        }

        setPaymentDetails({
            ...paymentDetails,
            [name]: formattedValue
        });
    };

    const validatePaymentDetails = () => {
        const newErrors = {};
        
        switch (selectedPayment) {
            case 'card':
                const cardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
                // Allow test card or valid card numbers
                if (cardNumber !== TEST_CARD.number && !/^[0-9]{16}$/.test(cardNumber)) {
                    newErrors.cardNumber = 'Enter a valid 16-digit card number';
                }
                if (!paymentDetails.cardHolderName?.trim()) {
                    newErrors.cardHolderName = 'Cardholder name is required';
                }
                // More lenient expiry date validation
                if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentDetails.expiryDate?.replace(/\s/g, ''))) {
                    newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
                }
                if (!/^[0-9]{3,4}$/.test(paymentDetails.cvv)) {
                    newErrors.cvv = 'Enter valid CVV';
                }
                break;
            case 'upi':
                if (!/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(paymentDetails.upiId)) {
                    newErrors.upiId = 'Enter a valid UPI ID';
                }
                break;
            case 'netbanking':
                if (!paymentDetails.netBankingBank) {
                    newErrors.netBankingBank = 'Please select a bank';
                }
                break;
            case 'wallet':
                if (!paymentDetails.walletType) {
                    newErrors.walletType = 'Please select a wallet';
                }
                break;
            case 'emi':
                if (!paymentDetails.emiMonths) {
                    newErrors.emiMonths = 'Please select EMI duration';
                }
                if (!paymentDetails.emiBank) {
                    newErrors.emiBank = 'Please select bank for EMI';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const processPayment = async () => {
        if (!validatePaymentDetails()) {
            toast.error('Please check payment details');
            return;
        }

        setLoading(true);
        try {
            // Validate order status before processing payment
            if (!orderData.orderId) {
                throw new Error('Invalid order data');
            }

            // Update order with payment details
            const updatedOrder = {
                ...orderData,
                paymentStatus: selectedPayment === 'cod' ? 'NOTPAID' : 'PAID',
                orderStatus: selectedPayment === 'cod' ? 'PENDING' : 'CONFIRMED',
                paymentMethod: selectedPayment,
                deliveredDate: selectedPayment === 'cod' ? null : new Date().getTime()
            };

            const response = await updateOroder(updatedOrder, updatedOrder.orderId);
            
            if (response && response.orderStatus) {
                toast.success("Payment processed successfully!");
                // Clear cart after successful payment
                localStorage.removeItem('cart');
                navigate("/users/orders", { replace: true });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Error in processing payment. Please try again later.";
            
            toast.error(errorMessage);

            // If inventory error, redirect to cart
            if (errorMessage.includes('inventory') || errorMessage.includes('stock')) {
                toast.info("Redirecting to cart to review available items...");
                setTimeout(() => navigate("/cart"), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Base>
            <Container className="mt-4">
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Card className="shadow">
                            <Card.Body>
                                <h3 className="text-center mb-4">Choose Payment Method</h3>
                                
                                <div className="payment-methods mb-4">
                                    <Row>
                                        <Col md={4}>
                                            <Card 
                                                className={`payment-method-card ${selectedPayment === 'card' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodChange('card')}
                                            >
                                                <Card.Body className="text-center">
                                                    <i className="fas fa-credit-card mb-2"></i>
                                                    <h5>Card Payment</h5>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card 
                                                className={`payment-method-card ${selectedPayment === 'upi' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodChange('upi')}
                                            >
                                                <Card.Body className="text-center">
                                                    <i className="fas fa-mobile-alt mb-2"></i>
                                                    <h5>UPI Payment</h5>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card 
                                                className={`payment-method-card ${selectedPayment === 'cod' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodChange('cod')}
                                            >
                                                <Card.Body className="text-center">
                                                    <i className="fas fa-money-bill mb-2"></i>
                                                    <h5>Cash on Delivery</h5>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>

                                {selectedPayment === 'card' && (
                                    <Form className="mt-4">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                onClick={fillTestCard}
                                            >
                                                Use Test Card
                                            </Button>
                                        </div>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Card Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cardNumber"
                                                value={paymentDetails.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="4111 1111 1111 1111"
                                                maxLength="19"
                                                isInvalid={!!errors.cardNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.cardNumber}
                                            </Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                For testing, use the test card number shown in the placeholder
                                            </Form.Text>
                                            <Form.Control
                                                type="text"
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={paymentDetails.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Card Holder Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cardHolderName"
                                                placeholder="John Doe"
                                                value={paymentDetails.cardHolderName}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Row>
                                            <Col md={8}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Expiry Date</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="expiryDate"
                                                        placeholder="MM/YY"
                                                        value={paymentDetails.expiryDate}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>CVV</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="cvv"
                                                        placeholder="***"
                                                        maxLength="3"
                                                        value={paymentDetails.cvv}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}

                                {selectedPayment === 'upi' && (
                                    <Form className="mt-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>UPI ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="upiId"
                                                placeholder="example@upi"
                                                value={paymentDetails.upiId}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Form>
                                )}

                                {selectedPayment === 'cod' && (
                                    <div className="mt-4 text-center">
                                        <i className="fas fa-info-circle text-info"></i>
                                        <p>Pay at the time of delivery</p>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <p className="mb-3">Total Amount: ₹{orderData?.orderAmount?.toFixed(2)}</p>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={processPayment}
                                        disabled={!selectedPayment || loading}
                                    >
                                        {loading ? (
                                            <>Processing...</>
                                        ) : (
                                            <>Proceed to Pay</>
                                        )}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};

export default PaymentPage;