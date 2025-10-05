import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { privateAxios } from '../../services/axios.service';
import { toast } from 'react-toastify';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: '',
    processingNotes: '',
    refundAmount: 0
  });

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await privateAxios.get('/returns');
      setReturns(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to fetch returns');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProcessReturn = async (e) => {
    e.preventDefault();
    try {
      await privateAxios.put('/returns/' + selectedReturn.id + '/process', null, {
        params: {
          status: formData.status,
          notes: formData.processingNotes,
          processedByUserId: 'admin' // Replace with actual admin user ID
        }
      });

      if (formData.status === 'APPROVED' && formData.refundAmount > 0) {
        await privateAxios.put('/returns/' + selectedReturn.id + '/refund', null, {
          params: {
            refundAmount: formData.refundAmount
          }
        });
      }

      toast.success('Return request processed successfully');
      setShowModal(false);
      fetchReturns();
    } catch (error) {
      console.error('Error processing return:', error);
      toast.error('Failed to process return');
    }
  };

  const handleViewReturn = (returnRequest) => {
    setSelectedReturn(returnRequest);
    setFormData({
      status: returnRequest.status,
      processingNotes: returnRequest.processingNotes || '',
      refundAmount: returnRequest.refundAmount || 0
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'REFUNDED': 'info'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return <div>Loading returns...</div>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Returns Management</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Request Date</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Refund Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(returnRequest => (
            <tr key={returnRequest.id}>
              <td>{returnRequest.orderId}</td>
              <td>{new Date(returnRequest.requestDate).toLocaleString()}</td>
              <td>{getStatusBadge(returnRequest.status)}</td>
              <td>{returnRequest.reason}</td>
              <td>
                {returnRequest.refundIssued ? 
                  `$${returnRequest.refundAmount.toFixed(2)}` : 
                  'Not issued'
                }
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewReturn(returnRequest)}
                  disabled={returnRequest.status === 'REFUNDED'}
                >
                  Process
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Return Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProcessReturn}>
            <Form.Group className="mb-3">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                value={selectedReturn?.orderId || ''}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Return Reason</Form.Label>
              <Form.Control
                as="textarea"
                value={selectedReturn?.reason || ''}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="APPROVED">Approve</option>
                <option value="REJECTED">Reject</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Processing Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="processingNotes"
                value={formData.processingNotes}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {formData.status === 'APPROVED' && (
              <Form.Group className="mb-3">
                <Form.Label>Refund Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="refundAmount"
                  value={formData.refundAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              Process Return
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminReturns;