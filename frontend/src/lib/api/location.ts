import apiClient from './client';
import type { ApiResourceResponse, Location } from '../../types';

export const locationApi = {
  getLocation: async () => {
    const response = await apiClient.get<ApiResourceResponse<Location>>('/location');
    return response.data.data;
  },
};
