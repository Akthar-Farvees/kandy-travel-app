import apiClient from './client';
import type {
  ApiResourceResponse,
  FilterState,
  PaginatedResponse,
  Product,
  ProductPayload,
} from '../../types';

export const productsApi = {
  getProducts: async (filters: FilterState) => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params: filters });
    return response.data;
  },
  
  getProduct: async (id: number) => {
    const response = await apiClient.get<ApiResourceResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  getCategories: async () => {
    const response = await apiClient.get<{ data: string[] }>('/products/categories');
    return response.data.data;
  },

  adminGetProducts: async (params: FilterState) => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/admin/products', { params });
    return response.data;
  },

  createProduct: async (data: ProductPayload) => {
    const response = await apiClient.post<ApiResourceResponse<Product>>('/admin/products', data);
    return response.data.data;
  },

  updateProduct: async (id: number, data: Partial<ProductPayload>) => {
    const response = await apiClient.put<ApiResourceResponse<Product>>(`/admin/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: number) => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};
