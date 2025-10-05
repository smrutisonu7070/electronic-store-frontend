import { privateAxios } from "./axios.service";
import { BASE_URL } from "./helper.service";

// Product Reviews
export const createProductReview = async (productId, reviewData) => {
    const response = await privateAxios.post(`${BASE_URL}/reviews`, {
        productId: productId,
        rating: reviewData.rating,
        review: reviewData.review,
        userId: reviewData.userId
    });
    return response.data;
};

export const getProductReviews = async (productId, page = 0) => {
    const response = await privateAxios.get(`${BASE_URL}/products/${productId}/reviews?pageNumber=${page}`);
    return response.data;
};

export const getProductRating = async (productId) => {
    const response = await privateAxios.get(`${BASE_URL}/products/${productId}/reviews/rating`);
    return response.data;
};

// Wishlist
export const addToWishlist = async (userId, productId) => {
    const response = await privateAxios.post(`${BASE_URL}/users/${userId}/wishlist/${productId}`);
    return response.data;
};

export const removeFromWishlist = async (userId, productId) => {
    const response = await privateAxios.delete(`${BASE_URL}/users/${userId}/wishlist/${productId}`);
    return response.data;
};

export const getWishlist = async (userId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist`);
    return response.data;
};

export const checkInWishlist = async (userId, productId) => {
    const response = await privateAxios.get(`${BASE_URL}/users/${userId}/wishlist/${productId}/check`);
    return response.data;
};

// Product Recommendations
export const getRecommendedProducts = async (userId, limit = 5) => {
    const response = await privateAxios.get(`${BASE_URL}/products/recommendations/user/${userId}?limit=${limit}`);
    return response.data;
};

export const getSimilarProducts = async (productId, limit = 5) => {
    const response = await privateAxios.get(`${BASE_URL}/products/recommendations/${productId}/similar?limit=${limit}`);
    return response.data;
};

export const getMostViewedProducts = async (limit = 5) => {
    const response = await privateAxios.get(`${BASE_URL}/products/recommendations/most-viewed?limit=${limit}`);
    return response.data;
};