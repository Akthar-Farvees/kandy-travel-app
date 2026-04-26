export const PRODUCT_CATEGORIES = [
  'tea',
  'handicraft',
  'jewelry',
  'spice',
  'textile',
  'pottery',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Location {
  id: number;
  name: string;
  slug: string;
  description: string;
  hero_image: string | null;
  products_count: number;
}

export interface ProductLocation {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  short_description: string;
  category: ProductCategory;
  price: number;
  formatted_price: string;
  image_url: string | null;
  tags: string[];
  is_active: boolean;
  location_id: number;
  location?: ProductLocation;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface ApiResourceResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  errors?: Record<string, string[]>;
  error_code?: string | null;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface FilterState {
  q?: string;
  category?: ProductCategory;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  per_page?: number;
  is_active?: boolean;
}

export interface ProductPayload {
  location_id: number;
  name: string;
  short_description: string;
  category: ProductCategory;
  price: number;
  image_url?: string | null;
  tags?: string[];
  is_active?: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
