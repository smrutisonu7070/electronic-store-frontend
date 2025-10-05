import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

// Subscribe to stock notifications
export const subscribeToStockNotification = async (userId, productId) => {
    const response = await privateAxios.post(`${BASE_URL}/stock-notifications/users/${userId}/products/${productId}`);
    return response.data;
};

// Unsubscribe from stock notifications
export const unsubscribeFromStockNotification = async (userId, productId) => {
    const response = await privateAxios.delete(`${BASE_URL}/stock-notifications/users/${userId}/products/${productId}`);
    return response.data;
};

// Get user's notifications
export const getUserNotifications = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/stock-notifications/users/${userId}`);
    return response.data;
};