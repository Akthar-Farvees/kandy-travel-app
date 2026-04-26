import { useState, useEffect } from 'react';
import { productsApi } from '../lib/api/products';
import { getApiErrorMessage } from '../lib/utils';
import type { FilterState, Product } from '../types';

export function useProducts(initialFilters: FilterState = { page: 1, per_page: 12 }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsApi.getProducts(filters);
        setProducts(response.data);
        setTotal(response.meta.total);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Failed to fetch products.'));
      } finally {
        setIsLoading(false);
      }
    };

    let isCancelled = false;
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        void fetchProducts();
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [filters]);

  return {
    products,
    total,
    filters,
    setFilters,
    isLoading,
    error,
  };
}
