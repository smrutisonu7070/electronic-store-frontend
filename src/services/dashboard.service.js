import { privateAxios } from './axios.service';

export const getDashboardStats = async () => {
  try {
    const response = await privateAxios.get('/admin/dashboard/stats');
    return response.data;  // response.data.data will contain the stats
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};