import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { privateAxios } from '../../services/axios.service';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    description: '',
    discountPercent: 0,
    maxDiscount: 0,
    minPurchaseAmount: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date().toISOString().split('T')[0],
    active: true,
    usageLimit: 0
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await privateAxios.get('/coupons');
      console.log('Fetched coupons:', response.data.content);
      setCoupons(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data properly before sending
      const dataToSend = {
        ...formData,
        discountPercent: parseFloat(formData.discountPercent),
        maxDiscount: parseFloat(formData.maxDiscount),
        minPurchaseAmount: parseFloat(formData.minPurchaseAmount),
        usageLimit: parseInt(formData.usageLimit),
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null
      };
      
      // Log the data being sent for debugging
      console.log('Sending data:', dataToSend);

      if (selectedCoupon) {
        // Send PUT request with the form data ID
        await privateAxios.put(`/coupons/${formData.id}`, dataToSend);
        toast.success('Coupon updated successfully');
      } else {
        await privateAxios.post('/coupons', dataToSend);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 'Failed to save coupon';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await privateAxios.delete('/coupons/' + couponId);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    // Convert dates to local timezone and format correctly
    const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : new Date();
    const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : new Date();
    
    setFormData({
      id: coupon.id, // Add the ID to the form data
      code: coupon.code,
      description: coupon.description,
      discountPercent: coupon.discountPercent,
      maxDiscount: coupon.maxDiscount,
      minPurchaseAmount: coupon.minPurchaseAmount,
      validFrom: validFrom.toISOString().split('T')[0],
      validUntil: validUntil.toISOString().split('T')[0],
      active: coupon.active,
      usageLimit: coupon.usageLimit
    });
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading coupons...</div>;
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Coupon Management</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCoupon(null);
            setFormData({
              id: null,
              code: '',
              description: '',
              discountPercent: 0,
              maxDiscount: 0,
              minPurchaseAmount: 0,
              validFrom: new Date().toISOString().split('T')[0],
              validUntil: new Date().toISOString().split('T')[0],
              active: true,
              usageLimit: 0
            });
            setShowModal(true);
          }}
        >
          Create Coupon
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Discount</th>
            <th>Validity</th>
            <th>Usage</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.description}</td>
              <td>
                {coupon.discountPercent}%
                <br />
                <small>Max: ${coupon.maxDiscount}</small>
                <br />
                <small>Min Purchase: ${coupon.minPurchaseAmount}</small>
              </td>
              <td>
                {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }) : 'N/A'}
                <br />to<br />
                {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }) : 'N/A'}
              </td>
              <td>
                {coupon.timesUsed} / {coupon.usageLimit}
              </td>
              <td>
                <Badge bg={coupon.active ? 'success' : 'danger'}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(coupon)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(coupon.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedCoupon ? 'Edit Coupon' : 'Create Coupon'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                pattern="[A-Za-z0-9_-]+"
                placeholder="Enter coupon code"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter discount percentage (0-100)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Discount Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Enter maximum discount amount"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Minimum Purchase Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="minPurchaseAmount"
                value={formData.minPurchaseAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Enter minimum purchase amount"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valid From</Form.Label>
              <Form.Control
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valid Until</Form.Label>
              <Form.Control
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
                min="1"
                step="1"
                placeholder="Enter maximum number of uses"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedCoupon ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminCoupons;