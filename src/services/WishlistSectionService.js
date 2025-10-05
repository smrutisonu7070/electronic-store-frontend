import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

// Get user's wishlist sections
export const getWishlistSections = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist-sections`);
    return response.data;
};

// Create a new wishlist section
export const createWishlistSection = async (userId, data) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/wishlist-sections`, data);
    return response.data;
};

// Update a wishlist section
export const updateWishlistSection = async (userId, sectionId, data) => {
    const response = await privateAxios.put(`${BASE_URL}/users/${userId}/wishlist-sections/${sectionId}`, data);
    return response.data;
};

// Delete a wishlist section
export const deleteWishlistSection = async (userId, sectionId) => {
    const response = await privateAxios.delete(`${BASE_URL}/users/${userId}/wishlist-sections/${sectionId}`);
    return response.data;
};

// Get wishlist items by section
export const getWishlistBySection = async (userId, sectionId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist?sectionId=${sectionId}`);
    return response.data;
};