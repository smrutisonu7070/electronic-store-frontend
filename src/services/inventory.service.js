import { privateAxios } from "./axios.service";

// Get inventory details for a product
export const getProductInventory = async (productId) => {
    const result = await privateAxios.get(`/inventory/product/${productId}`);
    return result.data;
};

// Update stock for a product
export const updateProductStock = async (productId, quantity) => {
    try {
        const result = await privateAxios.patch(`/inventory/product/${productId}/stock?quantity=${quantity}`);
        return result.data;
    } catch (error) {
        console.error('Error updating stock:', error.response?.data || error.message);
        throw error;
    }
};

// Get low stock products
export const getLowStockProducts = async (pageNumber = 0, pageSize = 10) => {
    const result = await privateAxios.get(`/inventory/low-stock?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return result.data;
};

// Bulk update stock
export const bulkUpdateStock = async (productIds, quantities) => {
    const result = await privateAxios.post(`/inventory/bulk-update`, null, {
        params: {
            productIds,
            quantities
        }
    });
    return result.data;
};