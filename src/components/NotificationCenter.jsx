import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Badge, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'react-bootstrap-icons';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/NotificationService';
import UserContext from '../context/UserContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isLogin, userData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin) {
            loadNotifications();
            // Set up SSE connection
            const eventSource = new EventSource(`/api/notifications/subscribe/${userData.user.userId}`);
            eventSource.addEventListener('notification', (event) => {
                const notification = JSON.parse(event.data);
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            return () => {
                eventSource.close();
            };
        }
    }, [isLogin, userData]);

    const loadNotifications = () => {
        if (!isLogin) return;
        
        getUserNotifications(userData.user.userId)
            .then(response => {
                setNotifications(response.content);
                setUnreadCount(response.content.filter(n => !n.read).length);
            })
            .catch(error => console.error('Error loading notifications:', error));
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationAsRead(notification.id)
                .then(() => {
                    setUnreadCount(prev => prev - 1);
                    const updatedNotifications = notifications.map(n => 
                        n.id === notification.id ? { ...n, read: true } : n
                    );
                    setNotifications(updatedNotifications);
                });
        }

        // Handle navigation based on notification type
        if (notification.type === 'STOCK') {
            navigate(`/products/${notification.productId}`);
        }
    };

    const handleMarkAllAsRead = () => {
        markAllNotificationsAsRead(userData.user.userId)
            .then(() => {
                setUnreadCount(0);
                const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
                setNotifications(updatedNotifications);
            });
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-dark nav-link">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <h6 className="mb-0">Notifications</h6>
                    {unreadCount > 0 && (
                        <Button variant="link" size="sm" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <Dropdown.Divider />
                <ListGroup variant="flush">
                    {notifications.length === 0 ? (
                        <ListGroup.Item>No notifications</ListGroup.Item>
                    ) : (
                        notifications.map(notification => (
                            <ListGroup.Item 
                                key={notification.id}
                                action
                                onClick={() => handleNotificationClick(notification)}
                                className={!notification.read ? 'bg-light' : ''}
                            >
                                <div className="d-flex justify-content-between">
                                    <strong>{notification.title}</strong>
                                    <small className="text-muted">
                                        {formatDistanceToNow(new Date(notification.createdDate), { addSuffix: true })}
                                    </small>
                                </div>
                                <div>{notification.message}</div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationCenter;