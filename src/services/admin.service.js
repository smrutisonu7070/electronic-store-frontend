import { privateAxios } from './axios.service';

export const initializeInventory = async () => {
  try {
    const response = await privateAxios.post('/admin/initialize-inventory');
    return response.data;
  } catch (error) {
    console.error('Error initializing inventory:', error);
    throw error;
  }
};