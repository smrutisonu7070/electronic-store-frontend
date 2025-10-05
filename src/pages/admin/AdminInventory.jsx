import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Alert, Badge, Card } from 'react-bootstrap';
import { privateAxios } from '../../services/axios.service';
import { toast } from 'react-toastify';
import { initializeInventory } from '../../services/admin.service';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { BASE_URL } from '../../services/helper.service';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    currentStock: 0,
    lowStockThreshold: 5,
    reorderPoint: 10,
    sku: '',
    location: ''
  });
  const [bulkUpdateMode, setBulkUpdateMode] = useState(false);
  const [bulkItems, setBulkItems] = useState([]);
  const [initializing, setInitializing] = useState(false);

  const handleInitializeInventory = async () => {
    try {
      setIsInitializing(true);
      await initializeInventory();
      toast.success('Successfully initialized inventory for all products');
      
      // Fetch updated inventory and low stock data
      await fetchInventory();
      const response = await privateAxios.get('/inventory/low-stock');
      const lowStockData = response.data.content;
      
      // Show summary notification
      toast.info(`Found ${lowStockData.filter(item => item.quantity > 0).length} low stock items and ${lowStockData.filter(item => item.quantity === 0).length} out of stock items`);
    } catch (error) {
      console.error('Error initializing inventory:', error);
      toast.error('Failed to initialize inventory: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsInitializing(false);
    }
  };

  const stompClient = useRef(null);

  useEffect(() => {
    fetchInventory();
    
    // Initialize STOMP client
    const client = new Client({
      brokerURL: BASE_URL.replace('http://', 'ws://') + '/inventory-websocket',
      connectHeaders: {},
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      // Subscribe to inventory updates
      client.subscribe('/topic/inventory-updates', (message) => {
        const data = JSON.parse(message.body);
        if (data.type === 'STOCK_UPDATE' || data.type === 'PRODUCT_ADDED') {
          fetchInventory();
          
          // Show notification for low stock
          if (data.type === 'STOCK_UPDATE' && data.isLowStock) {
            toast.warning(`Low stock alert for product ${data.productId}! Current stock: ${data.currentStock}`);
          }
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('STOMP error:', frame);
      toast.error('Failed to connect to real-time updates');
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const fetchInventory = async () => {
    try {
      const [inventoryRes, lowStockRes] = await Promise.all([
        privateAxios.get('/inventory'),
        privateAxios.get('/inventory/low-stock')
      ]);

      const inventoryData = inventoryRes.data.content;
      setInventory(inventoryData);
      
      const lowStockData = lowStockRes.data.content;
      setLowStockItems(lowStockData.filter(item => item.quantity > 0 && item.quantity <= 5));
      setOutOfStockItems(lowStockData.filter(item => item.quantity === 0));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to fetch inventory data');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await privateAxios.put('/inventory/' + selectedItem.id, formData);
        toast.success('Inventory updated successfully');
      } else {
        await privateAxios.post('/inventory', formData);
        toast.success('Inventory item added successfully');
      }
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory:', error);
      toast.error('Failed to save inventory data');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      productId: item.productId,
      currentStock: item.currentStock,
      lowStockThreshold: item.lowStockThreshold,
      reorderPoint: item.reorderPoint,
      sku: item.sku,
      location: item.location
    });
    setShowModal(true);
  };

  const handleQuickUpdate = async (productId, newQuantity) => {
    try {
      await privateAxios.patch(`/inventory/product/${productId}/stock?quantity=${newQuantity}`);
      toast.success('Stock updated successfully');
      fetchInventory();
      
      // Check for low stock
      const item = inventory.find(i => i.productId === productId);
      if (item && newQuantity <= item.lowStockThreshold) {
        toast.warning(`Low stock alert for ${item.sku || productId}! Current stock: ${newQuantity}`);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleBulkUpdate = async () => {
    try {
      await privateAxios.post('/inventory/bulk-update', {
        productIds: bulkItems.map(item => item.productId),
        quantities: bulkItems.map(item => parseInt(item.quantity))
      });
      toast.success('Bulk update completed successfully');
      setBulkUpdateMode(false);
      setBulkItems([]);
      fetchInventory();
    } catch (error) {
      console.error('Error in bulk update:', error);
      toast.error('Failed to complete bulk update');
    }
  };

  const addBulkItem = () => {
    setBulkItems([...bulkItems, { productId: '', quantity: 0 }]);
  };

  const updateBulkItem = (index, field, value) => {
    const updated = [...bulkItems];
    updated[index][field] = value;
    setBulkItems(updated);
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h2>Inventory Management</h2>
                <div>
                  <Button 
                    variant="success"
                    onClick={handleInitializeInventory} 
                    disabled={isInitializing}
                    className="me-2"
                  >
                    {isInitializing ? 'Initializing...' : 'Initialize All Products'}
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setSelectedItem(null);
                      setFormData({
                        productId: '',
                        currentStock: 0,
                        lowStockThreshold: 5,
                        reorderPoint: 10,
                        sku: '',
                        location: ''
                      });
                      setShowModal(true);
                    }}
                    className="me-2"
                  >
                    Add New Item
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => setBulkUpdateMode(!bulkUpdateMode)}
                  >
                    {bulkUpdateMode ? 'Cancel Bulk Update' : 'Bulk Update'}
                  </Button>
                </div>
              </div>
              <Alert variant="info" className="mt-3 mb-0">
                <p className="mb-1">Use this page to:</p>
                <ul className="mb-2">
                  <li>Initialize inventory for all existing products</li>
                  <li>Track stock levels and get alerts for low stock</li>
                  <li>Quickly update product quantities</li>
                  <li>Set up automatic reordering thresholds</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {bulkUpdateMode ? (
        <div className="mb-4">
          <h4>Bulk Stock Update</h4>
          {bulkItems.map((item, index) => (
            <Row key={index} className="mb-2">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={(e) => updateBulkItem(index, 'productId', e.target.value)}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateBulkItem(index, 'quantity', e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button 
                  variant="danger"
                  onClick={() => setBulkItems(bulkItems.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="primary" onClick={addBulkItem} className="me-2">
            Add Item
          </Button>
          <Button 
            variant="success" 
            onClick={handleBulkUpdate}
            disabled={bulkItems.length === 0}
          >
            Update All
          </Button>
        </div>
      ) : (
        <>
          {/* Stock Alerts */}
          <Row className="mb-4">
            <Col md={6}>
              <Alert variant="warning">
                <Alert.Heading>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Low Stock Alert
                </Alert.Heading>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {inventory.filter(item => item.currentStock > 0 && item.currentStock <= item.lowStockThreshold).map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        <strong>{item.productId}</strong> - {item.currentStock} units left
                      </span>
                      <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </Alert>
            </Col>
            <Col md={6}>
              <Alert variant="danger">
                <Alert.Heading>
                  <i className="bi bi-x-circle me-2"></i>
                  Out of Stock
                </Alert.Heading>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {inventory.filter(item => item.currentStock === 0).map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        <strong>{item.productId}</strong>
                      </span>
                      <Button size="sm" variant="danger" onClick={() => handleEdit(item)}>
                        Restock Now
                      </Button>
                    </div>
                  ))}
                </div>
              </Alert>
            </Col>
          </Row>

          {/* Inventory Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product ID</th>
                <th>Stock Status</th>
                <th>Current Stock</th>
                <th>Low Stock Threshold</th>
                <th>Reorder Point</th>
                <th>Location</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id} className={
                  item.currentStock === 0 ? 'table-danger' :
                  item.currentStock <= item.lowStockThreshold ? 'table-warning' :
                  'table-default'
                }>
                  <td>{item.sku}</td>
                  <td>{item.productId}</td>
                  <td>
                    <Badge bg={
                      item.currentStock === 0 ? 'danger' :
                      item.currentStock <= item.lowStockThreshold ? 'warning' :
                      'success'
                    }>
                      {item.currentStock === 0 ? 'Out of Stock' :
                       item.currentStock <= item.lowStockThreshold ? 'Low Stock' :
                       'In Stock'}
                    </Badge>
                  </td>
                  <td>{item.currentStock}</td>
                  <td>{item.lowStockThreshold}</td>
                  <td>{item.reorderPoint}</td>
                  <td>{item.location}</td>
                  <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleEdit(item)} className="me-2">
                      Edit
                    </Button>
                    <Button 
                      variant={item.currentStock === 0 ? "danger" : "warning"} 
                      size="sm" 
                      onClick={() => {
                        handleQuickUpdate(item.productId, item.reorderPoint);
                      }}
                      className="me-2"
                    >
                      Restock
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => {
                        handleQuickUpdate(item.productId, item.currentStock + 1);
                      }}
                      className="me-2"
                    >
                      +1
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      disabled={item.currentStock === 0}
                      onClick={() => {
                        handleQuickUpdate(item.productId, Math.max(0, item.currentStock - 1));
                      }}
                    >
                      -1
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem ? 'Edit Inventory' : 'Add Inventory'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Stock</Form.Label>
              <Form.Control
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Low Stock Threshold</Form.Label>
              <Form.Control
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reorder Point</Form.Label>
              <Form.Control
                type="number"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedItem ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminInventory;