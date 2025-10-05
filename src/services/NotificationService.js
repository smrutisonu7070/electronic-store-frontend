import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

// Get user notifications
export const getUserNotifications = async (userId, pageNumber = 0, pageSize = 10) => {
    const response = await privateAxios.get(
        `${BASE_URL}/notifications/users/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    const response = await privateAxios.patch(`${BASE_URL}/notifications/${notificationId}/read`);
    return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
    const response = await privateAxios.patch(`${BASE_URL}/notifications/users/${userId}/read-all`);
    return response.data;
};

// Get unread count
export const getUnreadNotificationCount = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/notifications/users/${userId}/unread-count`);
    return response.data;
};