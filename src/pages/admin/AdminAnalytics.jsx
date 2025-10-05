import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import RefreshAnalyticsButton from '../../components/admin/RefreshAnalyticsButton';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { privateAxios } from '../../services/axios.service';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const [dailyStats, setDailyStats] = useState(null);
  const [categoryRevenue, setCategoryRevenue] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyStats();
    fetchCategoryRevenue();
    fetchOverallStats();
  }, []);

  const fetchOverallStats = async () => {
    try {
      const response = await privateAxios.get('/admin/dashboard/stats');
      if (response.data && response.data.data) {
        setOverallStats({
          totalProducts: response.data.data.products,
          totalCategories: response.data.data.categories,
          totalOrders: response.data.data.orders,
          totalUsers: response.data.data.users
        });
      }
    } catch (error) {
      console.error('Error fetching overall stats:', error);
      toast.error('Failed to fetch overall statistics');
    }
  };

  // Helper function to format date for backend
  const formatDateForBackend = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return formatDateForBackend(end);
  };

  const fetchDailyStats = async () => {
    try {
      setLoading(true);
      
      // Get today's date
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      
      try {
        // Generate analytics first and wait for it to complete
        await privateAxios.post('/analytics/generate');
        // Add a small delay to allow the analytics to be generated
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (genError) {
        console.error('Error generating analytics:', genError);
        // Continue even if generation fails, as we might have existing data
      }
      
      // Fetch daily stats with properly formatted date
      const response = await privateAxios.get('/analytics/daily', {
        params: {
          date: formatDateForBackend(startOfDay)
        }
      });

      if (response.data) {
        // Initialize stats with response data or default values
        const stats = {
          dailyRevenue: response.data.dailyRevenue || 0,
          totalOrders: response.data.totalOrders || 0,
          completedOrders: response.data.completedOrders || 0,
          averageOrderValue: response.data.averageOrderValue || 0,
          cancelledOrders: response.data.cancelledOrders || 0,
          totalProducts: response.data.totalProducts || 0,
          totalCustomers: response.data.totalCustomers || 0
        };

        // Check if we have any non-zero values
        const hasData = stats.dailyRevenue > 0 || 
                       stats.totalOrders > 0 || 
                       stats.completedOrders > 0;

        if (!hasData) {
          // If all values are zero, try to get data for a slightly wider time range
          const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
          const rangeResponse = await privateAxios.get('/analytics/range', {
            params: {
              startDate: formatDateForBackend(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)), // Last 7 days
              endDate: formatDateForBackend(endOfDay),
              pageNumber: 0,
              pageSize: 7,
              sortBy: 'date',
              sortDir: 'desc'
            }
          });

          if (rangeResponse.data && rangeResponse.data.content && rangeResponse.data.content.length > 0) {
            // Aggregate data from the last 7 days
            const aggregatedStats = rangeResponse.data.content.reduce((acc, curr) => ({
              dailyRevenue: acc.dailyRevenue + (curr.dailyRevenue || 0),
              totalOrders: acc.totalOrders + (curr.totalOrders || 0),
              completedOrders: acc.completedOrders + (curr.completedOrders || 0),
              cancelledOrders: acc.cancelledOrders + (curr.cancelledOrders || 0),
              totalProducts: Math.max(acc.totalProducts, curr.totalProducts || 0),
              totalCustomers: Math.max(acc.totalCustomers, curr.totalCustomers || 0)
            }), {
              dailyRevenue: 0,
              totalOrders: 0,
              completedOrders: 0,
              cancelledOrders: 0,
              totalProducts: 0,
              totalCustomers: 0
            });

            // Calculate average order value
            aggregatedStats.averageOrderValue = aggregatedStats.totalOrders > 0 
              ? aggregatedStats.dailyRevenue / aggregatedStats.totalOrders 
              : 0;

            setDailyStats(aggregatedStats);
            toast.info('Showing aggregated data from the last 7 days');
          } else {
            const emptyStats = {
              dailyRevenue: 0,
              totalOrders: 0,
              completedOrders: 0,
              averageOrderValue: 0,
              cancelledOrders: 0,
              totalProducts: 0,
              totalCustomers: 0
            };
            setDailyStats(emptyStats);
            toast.warning('No sales data found for the selected period');
          }
        } else {
          setDailyStats(stats);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      
      // More specific error messages based on the error type
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('No analytics data found. Please try again later.');
        } else if (error.response.status === 403) {
          toast.error('You do not have permission to view analytics.');
        } else {
          toast.error(error.response.data?.message || 'Failed to fetch statistics.');
        }
      } else if (error.request) {
        toast.error('Cannot connect to the server. Please check your connection.');
      } else {
        toast.error('An error occurred while fetching statistics.');
      }
      
      setLoading(false);
    }
  };

  const fetchCategoryRevenue = async () => {
    try {
      // Fetch all categories first
      const categoriesResponse = await privateAxios.get('/categories');
      const categories = categoriesResponse.data.content;
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days

      const startDateStr = formatDateForBackend(startDate);
      const endDateStr = formatDateForBackend(endDate);

      // Fetch revenue data for each category
      const revenuePromises = categories.map(category =>
        privateAxios.get('/analytics/category/' + category.categoryId, {
          params: {
            startDate: formatDateForBackend(startDate),
            endDate: formatDateForBackend(endDate)
          }
        })
      );

      const revenueResponses = await Promise.all(revenuePromises);
      
      const data = {
        labels: categories.map(category => category.title),
        datasets: [{
          label: 'Revenue by Category',
          data: revenueResponses.map(response => response.data.dailyRevenue),
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      };
      
      setCategoryRevenue(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category revenue:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Row>
          <Col>
            <div className="d-flex flex-column align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading analytics data...</p>
              <small className="text-muted">This may take a few moments</small>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!dailyStats && !categoryRevenue) {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} className="text-center py-5">
            <div className="alert alert-warning">
              <h4 className="alert-heading">No Analytics Data Available</h4>
              <p>We couldn't find any analytics data for the current period. This could be because:</p>
              <ul className="list-unstyled">
                <li>• There haven't been any orders today</li>
                <li>• The analytics generation is still in progress</li>
                <li>• There might be a temporary system delay</li>
              </ul>
              <hr />
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setLoading(true);
                  fetchDailyStats();
                  fetchCategoryRevenue();
                }}
              >
                Refresh Analytics Data
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Sales Analytics Dashboard</h2>
        <RefreshAnalyticsButton
          onClick={() => {
            setLoading(true);
            fetchDailyStats();
            fetchCategoryRevenue();
          }}
          loading={loading}
        />
      </div>
      
      {/* Overall Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <h3>{overallStats?.totalProducts || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Categories</Card.Title>
              <h3>{overallStats?.totalCategories || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <h3>{overallStats?.totalOrders || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{overallStats?.totalUsers || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Daily Revenue</Card.Title>
              <h3>${(dailyStats?.dailyRevenue || 0).toFixed(2)}</h3>
              <small className="text-muted">Total sales for today</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Orders Summary</Card.Title>
              <div style={{ height: '150px' }}>
                <Pie
                  data={{
                    labels: ['Completed', 'Cancelled', 'Pending'],
                    datasets: [{
                      data: [
                        dailyStats?.completedOrders || 0,
                        dailyStats?.cancelledOrders || 0,
                        (dailyStats?.totalOrders || 0) - ((dailyStats?.completedOrders || 0) + (dailyStats?.cancelledOrders || 0))
                      ],
                      backgroundColor: ['#4caf50', '#f44336', '#ffc107']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 10,
                          padding: 5
                        }
                      }
                    }
                  }}
                />
              </div>
              <small className="text-muted mt-2">
                Total Orders: {dailyStats?.totalOrders || 0}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Revenue Distribution</Card.Title>
              <div style={{ height: '150px' }}>
                <Pie
                  data={{
                    labels: ['Average Order', 'Above Average', 'Below Average'],
                    datasets: [{
                      data: [
                        1,
                        dailyStats?.totalOrders > 0 ? 
                          dailyStats.dailyRevenue / dailyStats.totalOrders > dailyStats.averageOrderValue ? 1 : 0 : 0,
                        dailyStats?.totalOrders > 0 ? 
                          dailyStats.dailyRevenue / dailyStats.totalOrders < dailyStats.averageOrderValue ? 1 : 0 : 0
                      ],
                      backgroundColor: ['#2196f3', '#4caf50', '#ff9800']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 10,
                          padding: 5
                        }
                      }
                    }
                  }}
                />
              </div>
              <small className="text-muted mt-2">
                Avg. Order: ${(dailyStats?.averageOrderValue || 0).toFixed(2)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Customer Activity</Card.Title>
              <div style={{ height: '150px' }}>
                <Pie
                  data={{
                    labels: ['Active Customers', 'Products Sold'],
                    datasets: [{
                      data: [
                        dailyStats?.totalCustomers || 0,
                        dailyStats?.totalProducts || 0
                      ],
                      backgroundColor: ['#9c27b0', '#00bcd4']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 10,
                          padding: 5
                        }
                      }
                    }
                  }}
                />
              </div>
              <small className="text-muted mt-2">
                {dailyStats?.totalProducts || 0} products sold to {dailyStats?.totalCustomers || 0} customers
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Container>
  );
};

export default AdminAnalytics;