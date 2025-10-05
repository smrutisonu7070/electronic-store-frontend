import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

export const applyGiftCardToOrder = async (giftCardId, orderId) => {
    const response = await privateAxios.post(`${BASE_URL}/gift-cards/${giftCardId}/apply/${orderId}`);
    return response.data;
};

// Save For Later API calls
export const saveForLater = async (userId, productId, source) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/save-for-later/${productId}`, null, {
        params: { source }
    });
    return response.data;
};

export const getSavedItems = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/save-for-later`);
    return response.data;
};

export const moveToCart = async (userId, saveForLaterId) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/save-for-later/${saveForLaterId}/move-to-cart`);
    return response.data;
};

export const moveToWishlist = async (userId, saveForLaterId) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/save-for-later/${saveForLaterId}/move-to-wishlist`);
    return response.data;
};

export const removeSavedItem = async (userId, saveForLaterId) => {
    const response = await privateAxios.delete(`${BASE_URL}/users/${userId}/save-for-later/${saveForLaterId}`);
    return response.data;
};