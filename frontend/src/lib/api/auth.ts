import apiClient from './client';
import type { ApiResourceResponse, AuthCredentials, User } from '../../types';

export const authApi = {
  login: async (credentials: AuthCredentials) => {
    const response = await apiClient.post<{ token: string; token_type: string; user: User }>('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  me: async () => {
    const response = await apiClient.get<ApiResourceResponse<User>>('/auth/me');
    return response.data.data;
  },
};
