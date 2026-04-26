import apiClient from './client';
import type {
  ApiResourceResponse,
  FilterState,
  PaginatedResponse,
  Product,
  ProductPayload,
} from '../../types';

/**
 * Build an Axios config suitable for sending FormData.
 *
 * Setting Content-Type to `undefined` forces Axios to omit the header
 * entirely, which lets the browser auto-generate the correct
 * `multipart/form-data; boundary=...` value.
 */
function multipartConfig() {
  return {
    headers: {
      'Content-Type': undefined as unknown as string,
    },
  };
}

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

  createProduct: async (data: ProductPayload | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post<ApiResourceResponse<Product>>(
      '/admin/products',
      data,
      isFormData ? multipartConfig() : {},
    );
    return response.data.data;
  },

  updateProduct: async (id: number, data: Partial<ProductPayload> | FormData) => {
    // If it's FormData, we must use POST with _method=PUT because
    // PHP doesn't parse multipart/form-data on PUT requests.
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      const response = await apiClient.post<ApiResourceResponse<Product>>(
        `/admin/products/${id}`,
        data,
        multipartConfig(),
      );
      return response.data.data;
    }

    const response = await apiClient.put<ApiResourceResponse<Product>>(`/admin/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: number) => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};
