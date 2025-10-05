import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

// Get user's wishlist
export const getWishlist = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist`);
    return response.data;
};

// Add product to wishlist
export const addToWishlist = async (userId, productId) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/wishlist/${productId}`);
    return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (userId, productId) => {
    try {
        const response = await privateAxios.delete(`${BASE_URL}/users/${userId}/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error in removeFromWishlist:', error);
        throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
};

// Check if product is in wishlist
export const isProductInWishlist = async (userId, productId) => {
    try {
        const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist/check/${productId}`);
        return response.data;
    } catch (error) {
        return false;
    }
};