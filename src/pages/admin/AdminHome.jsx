import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { MdOutlineProductionQuantityLimits, MdOutlineCategory, MdAnalytics } from 'react-icons/md'
import { BsBorderStyle } from 'react-icons/bs'
import { FaUserSecret, FaBoxOpen } from 'react-icons/fa'
import { TbDiscount } from 'react-icons/tb'
import { BiSupport } from 'react-icons/bi'
import DashboardCardView from "../../components/DashboardCardView"
import { getDashboardStats } from "../../services/dashboard.service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import './AdminHome.css'
const AdminHome = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        recentOrders: [],
        customerActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch dashboard stats when component mounts
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                toast.error("Failed to load dashboard statistics");
            }
        } catch (error) {
            console.error("Error loading dashboard stats:", error);
            toast.error("Error loading dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Container className="text-center p-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    ) : (
        <Container className="admin-dashboard">
            <Row>
                <Col lg={8} className="mx-auto">
                    <Card className="welcome-card mb-4">
                        <Card.Body className="text-center p-5">
                            <h2 className="fw-bold mb-4">Welcome to Admin Dashboard</h2>
                            <p className="text-muted mb-4">Manage your electronic store with powerful tools. Add and manage products, categories, track orders, and handle user accounts all in one place.</p>
                            <div className="action-buttons-container">
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/categories'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <MdOutlineCategory className="me-2" />
                                            Manage Categories
                                        </Button>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/products'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <MdOutlineProductionQuantityLimits className="me-2" />
                                            Manage Products
                                        </Button>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/analytics'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <MdAnalytics className="me-2" />
                                            Sales Analytics
                                        </Button>
                                    </Col>
                                    
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/inventory'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <FaBoxOpen className="me-2" />
                                            Inventory Management
                                        </Button>
                                    </Col>
                                    
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/returns'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <BiSupport className="me-2" />
                                            Returns & Refunds
                                        </Button>
                                    </Col>
                                    
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/coupons'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <TbDiscount className="me-2" />
                                            Coupons & Discounts
                                        </Button>
                                    </Col>
                                    
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/users'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <FaUserSecret className="me-2" />
                                            Manage Users
                                        </Button>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            as={Link} 
                                            to={'/admin/orders'} 
                                            className="admin-action-btn w-100" 
                                            variant="light"
                                        >
                                            <BsBorderStyle className="me-2" />
                                            Manage Orders
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="stats-container g-4">
                <Col md={6} lg={3}>
                    <Card className="dashboard-card gradient-1 h-100">
                        <Card.Body className="text-center p-4">
                            <div className="stats-icon">
                                <MdOutlineProductionQuantityLimits size={50} />
                            </div>
                            <div className="stats-number text-white">{stats.products}</div>
                            <div className="stats-text text-white-50">Products</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="dashboard-card gradient-2 h-100">
                        <Card.Body className="text-center p-4">
                            <div className="stats-icon">
                                <MdOutlineCategory size={50} />
                            </div>
                            <div className="stats-number text-white">{stats.categories}</div>
                            <div className="stats-text text-white-50">Categories</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="dashboard-card gradient-3 h-100">
                        <Card.Body className="text-center p-4">
                            <div className="stats-icon">
                                <BsBorderStyle size={50} />
                            </div>
                            <div className="stats-number text-white">{stats.orders}</div>
                            <div className="stats-text text-white-50">Orders</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="dashboard-card gradient-4 h-100">
                        <Card.Body className="text-center p-4">
                            <div className="stats-icon">
                                <FaUserSecret size={50} />
                            </div>
                            <div className="stats-number text-white">{stats.users}</div>
                            <div className="stats-text text-white-50">Users</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Revenue and Activity Section */}
            <Row className="mt-4">
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header className="bg-transparent">
                            <h5 className="mb-0">Revenue Distribution</h5>
                        </Card.Header>
                        <Card.Body>
                            {stats.revenueDistribution ? (
                                <div className="revenue-stats">
                                    <p><strong>Total Revenue:</strong> ₹{stats.revenue?.toLocaleString()}</p>
                                    <p><strong>Daily Revenue:</strong> ₹{stats.revenueDistribution?.daily?.toLocaleString()}</p>
                                    <p><strong>Weekly Revenue:</strong> ₹{stats.revenueDistribution?.weekly?.toLocaleString()}</p>
                                    <p><strong>Monthly Revenue:</strong> ₹{stats.revenueDistribution?.monthly?.toLocaleString()}</p>
                                </div>
                            ) : (
                                <p className="text-muted">No revenue data available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header className="bg-transparent">
                            <h5 className="mb-0">Customer Activity</h5>
                        </Card.Header>
                        <Card.Body>
                            {stats.customerActivity && stats.customerActivity.length > 0 ? (
                                <div className="activity-feed">
                                    {stats.customerActivity.map((activity, index) => (
                                        <div key={index} className="activity-item mb-3">
                                            <p className="mb-1">
                                                <strong>{activity.user}</strong>
                                                <span className="text-muted ms-2">{activity.action}</span>
                                            </p>
                                            <small className="text-muted">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No recent customer activity</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminHome